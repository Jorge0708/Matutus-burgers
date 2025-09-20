# 🍔 Matutu's Burger - Sistema de Pedidos Online

Sistema de pedidos online para a hamburgueria Matutu's Burger, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🔒 Segurança Implementada

### ✅ Correções de Segurança Aplicadas

#### **Validação e Sanitização de Dados**
- ✅ Implementação de schemas de validação com Zod
- ✅ Sanitização de todos os inputs do usuário
- ✅ Validação de telefone com regex seguro
- ✅ Limitação de caracteres em campos de texto
- ✅ Validação de quantidade máxima de itens (10 por produto)

#### **Remoção de Vulnerabilidades Críticas**
- ✅ **REMOVIDO**: Credenciais hardcoded no código
- ✅ **REMOVIDO**: Página administrativa (conforme solicitado)
- ✅ **REMOVIDO**: Autenticação insegura baseada em localStorage
- ✅ **REMOVIDO**: Exposição de dados sensíveis na interface

#### **Implementação de Boas Práticas**
- ✅ Uso de variáveis de ambiente para dados sensíveis
- ✅ Geração segura de IDs de pedidos
- ✅ Formatação segura de números de telefone
- ✅ Limitação de tamanho de inputs
- ✅ Validação de tipos TypeScript rigorosa

### 🛡️ Medidas de Proteção

#### **Proteção contra Injeção**
- Sanitização de caracteres HTML (`<`, `>`)
- Remoção de URLs javascript:
- Remoção de event handlers (on*=)
- Validação de formato de telefone com regex

#### **Controle de Dados**
- Limite de 200 caracteres para observações
- Limite de 500 caracteres para endereços
- Limite de 10 itens por produto no carrinho
- Validação de nomes com apenas letras e espaços

#### **Segurança de Comunicação**
- URLs do WhatsApp são construídas de forma segura
- Dados são codificados antes do envio
- Números de telefone são formatados e validados

## 🚀 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

\`\`\`env
# Configurações do WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5581995130952

# Configurações da aplicação
NEXT_PUBLIC_APP_NAME="Matutu's Burger"
NEXT_PUBLIC_APP_SLOGAN="Onde o Sabor Vira Tradição!"

# URLs de desenvolvimento
NEXT_PUBLIC_DEV_URL=http://localhost:3000
\`\`\`

### Instalação

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
\`\`\`

## 📱 Funcionalidades

### Para Clientes
- ✅ Visualização do cardápio completo
- ✅ Adição de itens ao carrinho com observações
- ✅ Personalização de pedidos
- ✅ Escolha entre entrega e retirada
- ✅ Múltiplas formas de pagamento
- ✅ Envio automático via WhatsApp

### Segurança do Sistema
- ✅ Validação rigorosa de todos os inputs
- ✅ Sanitização de dados do usuário
- ✅ Proteção contra injeção de código
- ✅ Limitação de quantidade e tamanho de dados
- ✅ Geração segura de IDs de pedidos

## 🏗️ Arquitetura

\`\`\`
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globais
├── components/
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── menu-section.tsx      # Seção do menu
│   ├── cart.tsx              # Carrinho de compras
│   └── order-form.tsx        # Formulário de pedido
├── lib/
│   ├── validation.ts         # Schemas de validação
│   ├── security.ts           # Utilitários de segurança
│   └── utils.ts              # Utilitários gerais
└── public/
    └── images/               # Imagens estáticas
\`\`\`

## 🔧 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 📞 Contato

- **WhatsApp**: (81) 99513-0952
- **Instagram**: @matutusburguer01

## 📄 Licença

© 2024 Matutu's Burger. Todos os direitos reservados.

---

**⚠️ IMPORTANTE**: Este sistema foi desenvolvido com foco em segurança. Todas as vulnerabilidades identificadas foram corrigidas e boas práticas de desenvolvimento foram implementadas.
