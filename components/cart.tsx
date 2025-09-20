"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import type { CartItem } from "@/lib/validation"

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateItem: (id: number, observations: string | undefined, quantity: number) => void // Mudando tipo do id para number
  onProceedToOrder: () => void
}

export function Cart({ isOpen, onClose, items, onUpdateItem, onProceedToOrder }: CartProps) {
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl font-black text-primary">
            <ShoppingBag className="w-6 h-6" />
            <span>
              Seu Carrinho ({getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"})
            </span>
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">🛒</div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h3>
            <p className="text-muted-foreground mb-6">Adicione alguns deliciosos hambúrgueres!</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
              onClick={onClose}
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card
                key={`${item.id}-${index}`}
                className="border-2 border-primary/20 hover:border-primary/40 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        R$ {item.price.toFixed(2).replace(".", ",")} cada
                      </p>
                      {item.observations && (
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          📝 {item.observations}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateItem(item.id, item.observations, Math.max(0, item.quantity - 1))}
                        className="h-8 w-8 p-0 border-primary/30 hover:bg-primary hover:text-primary-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateItem(item.id, item.observations, Math.min(10, item.quantity + 1))} // Limitando quantidade máxima
                        className="h-8 w-8 p-0 border-primary/30 hover:bg-primary hover:text-primary-foreground"
                        disabled={item.quantity >= 10}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onUpdateItem(item.id, item.observations, 0)}
                        className="h-8 w-8 p-0 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary/10">
                    <span className="text-sm font-medium text-muted-foreground">Subtotal:</span>
                    <span className="font-bold text-lg text-primary">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-primary/5 border-2 border-primary/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-2xl font-black">
                  <span className="text-foreground">TOTAL:</span>
                  <span className="text-primary">R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent border-2 border-gray-300 hover:bg-gray-50 font-semibold"
              >
                Continuar Comprando
              </Button>
              <Button
                onClick={onProceedToOrder}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6"
              >
                🚀 Finalizar Pedido
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
