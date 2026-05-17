# 📄 Separador de PDF por CPF e Matrícula

Aplicação web que recebe um PDF contendo documentos de múltiplos colaboradores ( ex: espelho de ponto), identifica cada um pelo CPF e matrícula e gera um arquivo ZIP com os PDFs separados individualmente.

---

## 🚀 Como funciona

1. O usuário faz upload de um PDF com múltiplos documentos
2. A aplicação lê cada página e identifica o CPF e a matrícula
3. As páginas são agrupadas por colaborador
4. Um ZIP é gerado com um PDF por colaborador
5. O download é iniciado automaticamente

### Padrão de nomenclatura dos arquivos gerados

```
{cpf}_{matricula}.pdf

Exemplo: 12345678900_0001.pdf
```

Quando CPF ou matrícula não forem encontrados, o valor padrão é usado:

```
CPF_NAO_ENCONTRADO_0001.pdf
12345678900_MATRICULA_NAO_ENCONTRADA.pdf
```

---

## 🗂️ Estrutura do projeto

```
src/
├── app/
│   └── api/
│       └── split/
│           └── route.ts              # Endpoint que recebe o PDF e retorna o ZIP
│
├── components/
│   ├── fileUploadInput/
│   │   └── FileUploadInput.tsx       # Input de seleção de arquivo
│   ├── processButton/
│   │   └── ProcessButton.tsx         # Botão de iniciar processamento
│   ├── statusAlert/
│   │   └── StatusAlert.tsx           # Alertas de erro e sucesso
│   └── historyList/
│       └── HistoryList.tsx           # Lista do histórico de arquivos processados
│
├── hooks/
│   └── useHistory/
│       └── useHistory.ts             # Gerencia o histórico no localStorage
│
└── lib/
    ├── constants/
    │   └── constants.ts              # Regex e valores padrão
    ├── pdf/
    │   ├── extractPageTexts.ts       # Extrai texto de cada página do PDF
    │   ├── groupPagesByCpf.ts        # Agrupa páginas por CPF e matrícula
    │   └── buildPdfGroup.ts          # Cria um PDF por grupo
    └── zip/
        └── buildZip.ts               # Empacota os PDFs em um ZIP
```

---

## 🧩 Responsabilidade de cada arquivo

### Constantes — `constants.ts`

Centraliza as regex e valores padrão. Qualquer alteração no padrão de CPF, matrícula ou mensagens de fallback é feita aqui e reflete em todo o sistema.

```typescript
CPF_REGEX; // Captura CPF com ou sem formatação
MATRICULA_REGEX; // Captura matrícula precedida do prefixo "Matrícula:"
DEFAULT_CPF; // Valor usado quando CPF não é encontrado
DEFAULT_MATRICULA; // Valor usado quando matrícula não é encontrada
```

### Extração — `extractPageTexts.ts`

Carrega o PDF e extrai o texto de todas as páginas de uma vez, retornando um array onde cada posição corresponde a uma página.

### Agrupamento — `groupPagesByCpf.ts`

Itera sobre o array de textos, aplica as regex e agrupa as páginas por colaborador. Páginas sem CPF são anexadas ao grupo anterior.

### Construção do PDF — `buildPdfGroup.ts`

Recebe o PDF original e os índices das páginas de um grupo, copia essas páginas e gera um novo PDF.

### Empacotamento — `buildZip.ts`

Itera sobre todos os grupos, gera o PDF de cada um e adiciona ao ZIP com o nome `cpf_matricula.pdf`.

### Histórico — `useHistory.ts`

Hook que persiste o histórico de arquivos processados no `localStorage` do navegador, mantendo os 20 registros mais recentes.

---

## 🔍 Regex utilizadas

### CPF

```regex
/\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/
```

Aceita CPF com ou sem formatação:

- `123.456.789-00` ✅
- `12345678900` ✅

### Matrícula

```regex
/[Mm]atr[íi]cula[:\s]+(\d{4,8})/
```

Exige o prefixo `Matrícula:` para evitar falsos positivos com outros números do documento:

- `Matrícula: 0001` ✅
- `matricula: 12345` ✅
- `1234` ✅ (número solto — ignorado)

---

## 🛠️ Tecnologias

| Tecnologia      | Uso                           |
| --------------- | ----------------------------- |
| Next.js         | Framework principal           |
| TypeScript      | Tipagem estática              |
| Tailwind CSS v4 | Estilização                   |
| shadcn/ui       | Componentes de interface      |
| unpdf           | Extração de texto do PDF      |
| pdf-lib         | Manipulação e criação de PDFs |
| JSZip           | Geração do arquivo ZIP        |

---

## ⚙️ Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 📌 Observações

- O PDF de entrada deve conter o CPF e a matrícula na **primeira página de cada documento**, caso não tenha. Será salvo "CPF não encontrado" ou "Matricula não encontrada"
- O histórico é salvo no navegador via `localStorage` — não requer banco de dados
- O histórico é individual por navegador e não é compartilhado entre usuários
