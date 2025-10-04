"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, CreditCard, Phone, AlertTriangle } from "lucide-react"
import { customerDataSchema, type CartItem } from "@/lib/validation"
import { sanitizeInput, validatePhoneNumber, formatPhoneNumber, generateSecureOrderId } from "@/lib/security"

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  totalPrice: number
  onOrderComplete: () => void
}

// 👇 Mapa de bairros e taxas de entrega
const taxasPorBairro: Record<string, number> = {
  "céu azul": 5.00,
  "timbi": 6.00,
  "bairro novo": 7.00,
  "João Paulo": 8.00,
  "santa monita": 8.00,
  "santana": 9.00,
  "tabatinga": 10.00,
  "alberto maia": 8.00,
  "são lourenço": 12.00,
  "varzea": 12.00,
}

// 👇 Função que verifica se o endereço contém algum bairro do mapa
const calcularTaxaEntrega = (endereco: string) => {
  const enderecoLower = endereco.toLowerCase()
  for (const bairro in taxasPorBairro) {
    if (enderecoLower.includes(bairro)) {
      return taxasPorBairro[bairro]
    }
  }
  return 0 // valor padrão caso o bairro não esteja no mapa
}

export function OrderForm({ isOpen, onClose, cartItems, totalPrice, onOrderComplete }: OrderFormProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryType: "delivery" as const,
    paymentMethod: "money" as const,
    observations: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // 👇 Agora a taxa depende do bairro
  const deliveryFee = customerData.deliveryType === "delivery"
    ? calcularTaxaEntrega(customerData.address)
    : 0

  const finalTotal = totalPrice + deliveryFee

  const validateCustomerData = () => {
    const errors: string[] = []

    try {
      const validatedData = customerDataSchema.parse({
        ...customerData,
        name: sanitizeInput(customerData.name),
        phone: sanitizeInput(customerData.phone),
        address: customerData.address ? sanitizeInput(customerData.address) : undefined,
        observations: customerData.observations ? sanitizeInput(customerData.observations) : undefined,
      })

      if (!validatePhoneNumber(validatedData.phone)) {
        errors.push("Número de telefone inválido")
      }

      if (customerData.deliveryType === "delivery" && !customerData.address.trim()) {
        errors.push("Endereço é obrigatório para entrega")
      }

      return { isValid: errors.length === 0, errors, data: validatedData }
    } catch (error) {
      if (error instanceof Error) {
        errors.push("Dados inválidos fornecidos")
      }
      return { isValid: false, errors, data: null }
    }
  }

  const formatWhatsAppMessage = (orderNum: string) => {
    const sanitizedData = {
      name: sanitizeInput(customerData.name),
      phone: formatPhoneNumber(sanitizeInput(customerData.phone)),
      address: customerData.address ? sanitizeInput(customerData.address) : "",
      observations: customerData.observations ? sanitizeInput(customerData.observations) : "",
    }

    let message = `🍔 *NOVO PEDIDO - ${orderNum}*\n\n`
    message += `👤 *Cliente:* ${sanitizedData.name}\n`
    message += `📱 *Telefone:* ${sanitizedData.phone}\n\n`

    message += `🛍️ *Itens do Pedido:*\n`
    cartItems.forEach((item) => {
      const itemName = sanitizeInput(item.name)
      const itemObs = item.observations ? sanitizeInput(item.observations) : ""
      message += `• ${item.quantity}x ${itemName} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n`
      if (itemObs) {
        message += `  _Obs: ${itemObs}_\n`
      }
    })

    message += `\n💰 *Subtotal:* R$ ${totalPrice.toFixed(2).replace(".", ",")}\n`

    if (customerData.deliveryType === "delivery") {
      message += `🚚 *Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace(".", ",")}\n`
      message += `📍 *Endereço:* ${sanitizedData.address}\n`
    } else {
      message += `🏪 *Retirada no Balcão*\n`
    }

    message += `\n💳 *Forma de Pagamento:* ${
      customerData.paymentMethod === "money" ? "Dinheiro" : customerData.paymentMethod === "card" ? "Cartão" : "PIX"
    }\n`

    message += `\n💵 *TOTAL: R$ ${finalTotal.toFixed(2).replace(".", ",")}*\n`

    if (sanitizedData.observations) {
      message += `\n📝 *Observações:* ${sanitizedData.observations}\n`
    }

    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const validation = validateCustomerData()
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    const orderNum = generateSecureOrderId()
    setOrderNumber(orderNum)

    const whatsappMessage = formatWhatsAppMessage(orderNum)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5581995130952"
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    setShowConfirmation(true)

    setTimeout(() => {
      window.location.href = whatsappUrl
    }, 100)
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    onOrderComplete()
    onClose()
    setCustomerData({
      name: "",
      phone: "",
      address: "",
      deliveryType: "delivery",
      paymentMethod: "money",
      observations: "",
    })
    setValidationErrors([])
  }

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleConfirmationClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">✅</div>
            </div>
            <h3 className="text-2xl font-black text-primary mb-2">Pedido Enviado!</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Seu pedido <strong className="text-primary">{orderNumber}</strong> foi enviado via WhatsApp para a
              Matutu's Burger.
            </p>
            <div className="bg-primary/5 p-4 rounded-lg mb-4">
              <Badge className="mb-2 bg-secondary">Aguarde a confirmação</Badge>
              <p className="text-sm text-muted-foreground">Entraremos em contato em breve para confirmar seu pedido!</p>
            </div>
            <Button onClick={handleConfirmationClose} className="w-full bg-primary hover:bg-primary/90">
              Fazer Novo Pedido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">Finalizar Pedido</DialogTitle>
        </DialogHeader>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>Dados do Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  maxLength={100}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Telefone/WhatsApp *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(81) 99999-9999"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  maxLength={15}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Entrega */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Tipo de Entrega</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={customerData.deliveryType}
                onValueChange={(value) => setCustomerData((prev) => ({ ...prev, deliveryType: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="font-semibold">
                    Entrega (valor conforme o bairro)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="font-semibold">
                    Retirar no Balcão
                  </Label>
                </div>
              </RadioGroup>

              {customerData.deliveryType === "delivery" && (
                <div className="mt-4">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Endereço Completo *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, complemento..."
                    value={customerData.address}
                    onChange={(e) => setCustomerData((prev) => ({ ...prev, address: e.target.value }))}
                    required
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg font-bold flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Forma de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup
                value={customerData.paymentMethod}
                onValueChange={(value) => setCustomerData((prev) => ({ ...prev, paymentMethod: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="money" id="money" />
                  <Label htmlFor="money" className="font-semibold">
                    💵 Dinheiro
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="font-semibold">
                    💳 Cartão (Débito/Crédito)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="font-semibold">
                    📱 PIX
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg font-bold">Observações (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Alguma observação especial para seu pedido..."
                value={customerData.observations}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, observations: e.target.value }))}
                className="resize-none"
                maxLength={500}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Resumo do Pedido */}
          <Card className="bg-primary/5 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg font-black text-primary">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
              <hr className="border-primary/20" />
              <div className="flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between font-semibold">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <hr className="border-primary/20" />
              <div className="flex justify-between text-xl font-black text-primary">
                <span>TOTAL:</span>
                <span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-2 border-gray-300 hover:bg-gray-50"
            >
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
            >
              {isSubmitting ? "Enviando..." : "🚀 Enviar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
