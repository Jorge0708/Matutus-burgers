"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Clock, Phone, Instagram } from "lucide-react"
import { MenuSection } from "@/components/menu-section"
import { Cart } from "@/components/cart"
import { OrderForm } from "@/components/order-form"
import Image from "next/image"
import type { CartItem } from "@/lib/validation"

export interface MenuItem {
  id: number // Mudando para number para consistência com validação
  name: string
  description: string
  price: number
  category: "burgers" | "supremos" | "drinks" | "sides"
  image?: string
  popular?: boolean
}

const menuItems: MenuItem[] = [
  // MATUTU BURGUERS
  {
    id: 1, // Usando números em vez de strings
    name: "MATUTU'S BURGUER",
    description: "Carne bovina 80g queijo cheddar, salada e maionese.",
    price: 16.0,
    category: "burgers",
    popular: true,
  },
  {
    id: 2,
    name: "PUXA VIDA",
    description: "Carne bovina de 80g queijo e maionese",
    price: 15.0,
    category: "burgers",
  },
  {
    id: 3,
    name: "CABRA DA PESTE",
    description: "Carne bovina de 80g queijo cheddar, salada e ovo",
    price: 17.0,
    category: "burgers",
  },
  {
    id: 4,
    name: "OXE",
    description: "Carne bovina de 80g queijo cheddar, maionese e bacon",
    price: 18.0,
    category: "burgers",
    popular: true,
  },
  {
    id: 5,
    name: "OXENTE",
    description: "2 Carne bovinas de 80g queijo cheddar maionese e bacon",
    price: 20.0,
    category: "burgers",
  },
  // SUPREMOS
  {
    id: 6,
    name: "MEU FI",
    description: "Carne bovina de 150g queijo cheddar, cheddar cremoso maionese.",
    price: 22.0,
    category: "supremos",
    popular: true,
  },
  {
    id: 7,
    name: "LAMPIÃO BURGUER",
    description: "Carne bovina de 150g 2 fatias de queijo coalho, maionese, carne de sol Desfiada.",
    price: 25.0,
    category: "supremos",
  },
  {
    id: 8,
    name: "MATUTÃO",
    description: "2 Carne bovinas de 150g queijo cheddar,bacon,ovo, carne de sol desfiada.",
    price: 28.0,
    category: "supremos",
  },
  // Bebidas e acompanhamentos
  {
    id: 9,
    name: "Regrigerante 350ml",
    description: "Refrigerante gelado",
    price: 7.0,
    category: "drinks",
  },
  {
    id: 10,
    name: "Suco Natural 400ml",
    description: "Laranja, limão ou maracujá",
    price: 7.0,
    category: "drinks",
  },
  {
    id: 11,
    name: "Batata Frita",
    description: "Porção individual crocante com tempero especial",
    price: 10.0,
    category: "sides",
  },
]

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  const addToCart = (item: MenuItem, observations?: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id && cartItem.observations === observations)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id && cartItem.observations === observations
            ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, 10) } // Limitando quantidade máxima
            : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1, observations }]
    })
  }

  const updateCartItem = (id: number, observations: string | undefined, quantity: number) => {
    // Mudando tipo do id
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => !(item.id === id && item.observations === observations)))
    } else {
      setCartItems(
        (prev) =>
          prev.map((item) =>
            item.id === id && item.observations === observations ? { ...item, quantity: Math.min(quantity, 10) } : item,
          ), 
          // Limitando quantidade
      )
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black shadow-lg border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <Image src="/images/logo.png" alt="Matutu's Burger Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {process.env.NEXT_PUBLIC_APP_NAME?.split("'")[0] || "MATUTU'S"}
                </h1>
                <h2 className="text-2xl font-bold text-primary">BURGUER</h2>
                <p className="text-sm text-gray-300">
                  {process.env.NEXT_PUBLIC_APP_SLOGAN || "Onde o Sabor Vira Tradição!"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>18h-23h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>(81)99513-0952</span>
                </div>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => window.open("https://www.instagram.com/matutusburguer01", "_blank")}
                >
                    <Instagram className="w-4 h-4 text-primary" />
                    <span>@matutusburguer01</span>
                </div>

              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-secondary">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60 z-10" />
        <div className="absolute inset-0">
          <Image src="/images/menu-bg.jpeg" alt="Menu Background" fill className="object-cover opacity-40" />
        </div>
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-white">MATUTU'S</span>
              <br />
              <span className="text-primary">BURGUER</span>
            </h2>
            <p className="text-xl md:text-2xl mb-4 font-semibold">Onde o Sabor Vira Tradição!</p>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Hambúrgueres artesanais feitos com ingredientes frescos e muito amor. Peça agora e receba em casa ou
              retire no balcão!
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Rua SAN Martin 98 - Céu azul, Camaragibe - PE 
            </p>
            <Button
              size="lg"
              className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            >
              FAZER PEDIDO
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-foreground mb-4">NOSSO CARDÁPIO</h3>
            <p className="text-lg text-muted-foreground">Escolha entre nossos deliciosos hambúrgueres</p>
          </div>

          <MenuSection
            title="MATUTU BURGUERS"
            items={menuItems.filter((item) => item.category === "burgers")}
            onAddToCart={addToCart}
            bgColor="bg-primary"
          />

          <MenuSection
            title="SUPREMOS"
            items={menuItems.filter((item) => item.category === "supremos")}
            onAddToCart={addToCart}
            bgColor="bg-secondary"
          />

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <MenuSection
              title="🥤 BEBIDAS"
              items={menuItems.filter((item) => item.category === "drinks")}
              onAddToCart={addToCart}
            />

            <MenuSection
              title="🍟 ACOMPANHAMENTOS"
              items={menuItems.filter((item) => item.category === "sides")}
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </section>
      

      {/* Info Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Horário de Funcionamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Segunda a Domingo
                  <br />
                  18:00 às 23:00
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Contato</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  WhatsApp: (81)99513-0952
                  <br />
                  Instagram: @matutusburguer01
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Avaliação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-gray-300 ml-2">4.9/5 (127 avaliações)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.png" alt="Matutu's Burger Logo" fill className="object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">MATUTU'S </span>
              <span className="text-xl font-bold text-primary">BURGUER</span>
            </div>
          </div>
          <p className="text-gray-400">© 2024 Matutu's Burger. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Cart Modal */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateItem={updateCartItem}
        onProceedToOrder={() => {
          setShowCart(false)
          setShowOrderForm(true)
        }}
      />

      {/* Order Form Modal */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        cartItems={cartItems}
        totalPrice={getTotalPrice()}
        onOrderComplete={() => {
          setCartItems([])
          setShowOrderForm(false)
        }}
      />
    </div>
  )
}
