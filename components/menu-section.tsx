"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Star } from "lucide-react"
import type { MenuItem } from "@/app/page"
import { sanitizeInput } from "@/lib/security"

interface MenuSectionProps {
  title: string
  items: MenuItem[]
  onAddToCart: (item: MenuItem, observations?: string) => void
  bgColor?: string
}

export function MenuSection({ title, items, onAddToCart, bgColor = "bg-primary" }: MenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [observations, setObservations] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getProductImage = (item: MenuItem) => {
    const imageMap: { [key: string]: string } = {
      "MATUTU'S BURGUER": "/images/burgers/Matutus.png",
      "PUXA VIDA": "/images/burgers/puxa-vida.png",
      "CABRA DA PESTE": "/images/burgers/cabra-da-peste.png",
      OXE: "/images/burgers/oxe.png",
      OXENTE: "/images/burgers/Oxente.png",
      "MEU FI": "/images/burgers/meu-fi.png",
      "LAMPIÃO BURGUER": "/images/burgers/Lampiao.png",
      MATUTÃO: "/images/burgers/matutao.png",

      // Bebidas
      "Regrigerante 350ml": "/images/burgers/refrigerante.png",
      "Suco Natural 400ml": "/images/burgers/suco.png",

      // Acompanhamentos
      "Batata Frita": "/images/burgers/batata.png",
      
    }
    return imageMap[item.name] || "/images/burgers/matutus-burger.jpg"
  }

  const handleAddToCart = (item: MenuItem, obs?: string) => {
    const sanitizedObs = obs ? sanitizeInput(obs).substring(0, 200) : undefined
    onAddToCart(item, sanitizedObs)
    setObservations("")
    setIsDialogOpen(false)

  }

  return (
    <div className="mb-12">
      <div className={`${bgColor} text-white rounded-lg p-4 mb-6 text-center`}>
        <h4 className="text-2xl font-black tracking-wide">{title}</h4>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
          >
            {item.popular && (
              <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground z-10">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Popular
              </Badge>
            )}
            <div className="h-48 relative overflow-hidden">
              <img
                src={getProductImage(item) || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-foreground">{item.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-primary">R$ {item.price.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Personalizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Personalizar {selectedItem?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                          <img
                            src={selectedItem ? getProductImage(selectedItem) : "/images/burgers/matutus-burger.jpg"}
                            alt={selectedItem?.name || "Produto"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-lg font-semibold text-primary">
                          R$ {selectedItem?.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="observations" className="text-sm font-semibold">
                          Observações (opcional)
                        </Label>
                        <Textarea
                          id="observations"
                          placeholder="Ex: sem cebola, ponto da carne, molho à parte..."
                          value={observations}
                          onChange={(e) => setObservations(e.target.value)}
                          className="mt-2 resize-none"
                          maxLength={200}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{observations.length}/200 caracteres</p>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => selectedItem && handleAddToCart(selectedItem, observations)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Adicionar ao Carrinho
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
