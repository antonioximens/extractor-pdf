# 📄 Separador de PDF por Colaborador

Aplicação web que recebe um ou mais PDFs contendo documentos de vários colaboradores (ex: holerite, espelho de ponto, demonstrativos), identifica cada colaborador pelo **CPF**, **matrícula** e **nome** e gera um ZIP com **uma pasta por colaborador** e um PDF por tipo de documento.

---

## 🚀 Como funciona

1. O usuário faz upload de um ou mais PDFs
2. Para cada PDF, a aplicação detecta o tipo de documento (holerite, espelho de ponto...)
3. Cada página é lida e o CPF, a matrícula e o nome são extraídos
4. As páginas são agrupadas por CPF — o mesmo colaborador em vários PDFs cai na mesma pasta
5. Um ZIP é gerado com as pastas e um `relatorio.csv`, e o download é iniciado automaticamente

### Estrutura do ZIP gerado

```
documentos_separados.zip
├── 12345678909_0001_JOAO_DA_SILVA/
│   ├── espelho-ponto.pdf
│   └── holerite.pdf
├── 98765432100_0002_MARIA_SOUZA/
│   └── holerite.pdf
├── NAO_IDENTIFICADOS/
│   └── holerite_paginas_12-13.pdf
└── relatorio.csv
```

- **Pasta:** `{cpf}_{matricula}_{NOME}` — nome em maiúsculas, sem acentos e com `_` no lugar de espaços
- **Arquivo:** o tipo do documento detectado; se nenhum perfil reconhecer o PDF, usa o nome do arquivo enviado
- **Dois documentos do mesmo tipo** para o mesmo colaborador recebem sufixo (`holerite_2.pdf`)
- **Campos ausentes** usam `MATRICULA_NAO_ENCONTRADA` / `NOME_NAO_ENCONTRADO`
- **Páginas antes do primeiro CPF** vão para `NAO_IDENTIFICADOS`
- **`relatorio.csv`** (separado por `;`, abre direto no Excel) lista, para cada PDF gerado, as páginas de origem, os dados extraídos e observações (campo não encontrado, nome/matrícula divergente entre documentos)

---

## 🗂️ Estrutura do projeto

```
src/
├── app/
│   └── api/split/route.ts            # Recebe os PDFs e retorna o ZIP
│
├── components/
│   ├── pdfSplitter/PdfSplitter.tsx   # Tela principal
│   ├── fileUploadInput/              # Seleção de arquivos (múltiplos)
│   ├── processButton/                # Botão de iniciar processamento
│   ├── statusAlert/                  # Alertas de erro e sucesso
│   └── historyList/                  # Histórico de arquivos processados
│
├── hooks/
│   ├── useSplitPdf/useSplitPdf.ts    # Envio para a API e download do ZIP
│   └── useHistory/useHistory.ts      # Histórico no localStorage
│
└── lib/
    ├── constants/constants.ts        # Regex de CPF e valores padrão
    ├── cpf/findValidCpf.ts           # Busca e valida CPF (dígitos verificadores)
    ├── profiles/profiles.ts          # Perfis de documento e extração de nome/matrícula
    ├── pdf/
    │   ├── extractPageTexts.ts       # Extrai o texto de cada página
    │   ├── groupPagesByEmployee.ts   # Agrupa as páginas por CPF
    │   └── buildPdfGroup.ts          # Cria um PDF com as páginas de um grupo
    ├── split/
    │   ├── splitDocuments.ts         # Orquestra todo o processamento
    │   └── employeeFolders.ts        # Consolida colaboradores e nomeia as pastas
    ├── report/buildReportCsv.ts      # Gera o relatorio.csv
    ├── text/                         # Utilitários de texto (nomes de pasta, faixas de página)
    └── zip/buildZip.ts               # Monta o ZIP
```

---

## 🧩 Perfis de documento — `profiles.ts`

Cada perfil reconhece um tipo de documento pela primeira página e pode sobrescrever os padrões de extração de nome e matrícula:

| Perfil                | Detectado por                                                 |
| --------------------- | ------------------------------------------------------------- |
| `ferias`              | aviso/recibo de férias                                         |
| `informe-rendimentos` | informe/comprovante de rendimentos                             |
| `espelho-ponto`       | espelho/cartão/folha de ponto                                  |
| `holerite`            | holerite, contracheque, recibo/demonstrativo/folha de pagamento |
| `demonstrativo`       | demonstrativo (genérico)                                       |

**Para suportar um novo documento**, adicione um perfil em `PROFILES`. Se o layout usar rótulos diferentes, informe `fields` com as regex próprias (com a flag `g`).

### Extração padrão

- **CPF:** `\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b` — com ou sem formatação, **validado pelos dígitos verificadores** (sequências como telefones são ignoradas)
- **Matrícula:** número de 3 a 10 dígitos após `Matrícula`, `Matr.`, `Mat.`, `Registro`, `Chapa` ou `Cód. Funcionário`
- **Nome:** texto após `Nome`, `Nome do Funcionário`, `Funcionário`, `Colaborador`, `Empregado` ou `Servidor`, até o fim da linha ou o próximo rótulo. Exige nome e sobrenome e ignora `Nome da Empresa`, `Nome da Mãe` etc.

Páginas sem CPF continuam no grupo do último CPF encontrado; o mesmo CPF em trechos diferentes do PDF é unido em um único arquivo.

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

> Requer um Node.js com suporte a `Promise.try` (usado pelo pdf.js do `unpdf`). No Node 22.14 a extração falha com `Promise.try is not a function`.

---

## 📌 Observações

- PDFs escaneados (imagem, sem texto) não são suportados — exigiriam OCR
- O histórico é salvo no navegador via `localStorage` — não requer banco de dados
- O histórico é individual por navegador e não é compartilhado entre usuários
