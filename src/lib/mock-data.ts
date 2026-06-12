import type { DocumentItem, Folder } from "./types"

// Datos de ejemplo (mock). Cuando se conecte SQL Server, estos arrays
// se reemplazarán por consultas a la base de datos.

export const mockFolders: Folder[] = [
  { id: "f-contratos", name: "Contratos" },
  { id: "f-facturas", name: "Facturas" },
  { id: "f-rrhh", name: "Recursos Humanos" },
  { id: "f-legal", name: "Legal" },
  { id: "f-marketing", name: "Marketing" },
]

export const mockDocuments: DocumentItem[] = [
  {
    id: "d-1",
    name: "Contrato de arrendamiento 2025.pdf",
    type: "pdf",
    folderId: "f-contratos",
    tags: ["importante", "firmado"],
    size: 482_300,
    createdAt: "2025-01-14T10:24:00.000Z",
    favorite: true,
    description: "Contrato de arrendamiento de las oficinas principales en Providencia. Renovado en Enero de 2025.",
    mockContent: {
      title: "CONTRATO DE ARRENDAMIENTO COMERCIAL",
      code: "CT-2025-098-PR",
      sections: [
        {
          title: "1. PARTES CONTRATANTES",
          text: "De una parte, OFIMUNDO LIMITADA, en adelante el 'Arrendador', y de la otra parte, CORPORACIÓN DE SISTEMAS ASOCIADOS, en adelante el 'Arrendatario'. Ambas partes comparecen debidamente representadas."
        },
        {
          title: "2. OBJETO DEL CONTRATO",
          text: "El Arrendador entrega en arrendamiento el inmueble comercial ubicado en Avenida Providencia 2345, Oficina 801, comuna de Providencia, Santiago, Chile."
        },
        {
          title: "3. CANON DE ARRENDAMIENTO",
          text: "La renta mensual acordada asciende a la suma de UF 75 (setenta y cinco Unidades de Fomento), pagaderos dentro de los primeros 5 días de cada mes calendario."
        },
        {
          title: "4. VIGENCIA",
          text: "El presente contrato tendrá una duración de 36 meses obligatorios para ambas partes, comenzando a regir el 1 de Febrero de 2025."
        }
      ],
      signatures: ["Representante Arrendador", "Representante Arrendatario"]
    }
  },
  {
    id: "d-2",
    name: "Factura proveedor marzo.pdf",
    type: "pdf",
    folderId: "f-facturas",
    tags: ["pendiente"],
    size: 128_900,
    createdAt: "2025-03-02T08:10:00.000Z",
    description: "Factura por servicios de consultoría tecnológica del mes de Marzo de 2025.",
    mockContent: {
      title: "FACTURA ELECTRÓNICA",
      code: "FE-849302-B",
      invoiceDetails: {
        issuer: "Tecnología y Sistemas Avanzados SpA",
        rut: "76.492.302-K",
        client: "OFIMUNDO TI",
        date: "2025-03-02",
        dueDate: "2025-04-02",
        items: [
          { description: "Mantenimiento Servidores Cloud (SaaS)", quantity: 1, price: 450000, total: 450000 },
          { description: "Soporte Técnico Especializado On-site", quantity: 12, price: 35000, total: 420000 },
          { description: "Licenciamiento Antivirus Corporativo (Anual)", quantity: 20, price: 12500, total: 250000 }
        ],
        subtotal: 1120000,
        tax: 212800, // 19% IVA
        total: 1332800
      }
    }
  },
  {
    id: "d-3",
    name: "Logo corporativo.png",
    type: "image",
    folderId: "f-marketing",
    tags: ["marca"],
    size: 845_120,
    createdAt: "2025-02-20T16:45:00.000Z",
    favorite: true,
    description: "Logo corporativo oficial en alta resolución con transparencia (PNG).",
    mockContent: {
      gradient: "linear-gradient(135deg, #2A3284 0%, #70317A 50%, #D2446A 100%)",
      dimensions: "2048 x 1536 px",
      colorPalette: ["#2A3284", "#70317A", "#D2446A"],
      svgLogo: true
    }
  },
  {
    id: "d-4",
    name: "Política de vacaciones.docx",
    type: "word",
    folderId: "f-rrhh",
    tags: ["interno"],
    size: 64_500,
    createdAt: "2025-01-30T12:00:00.000Z",
    description: "Políticas internas y guía de solicitud de vacaciones para empleados en Chile.",
    mockContent: {
      title: "POLÍTICA INTERNA DE VACACIONES Y PERMISOS",
      version: "V3.2 - 2025",
      body: [
        "El presente documento detalla el procedimiento y las políticas aplicables para la solicitud de vacaciones y permisos especiales dentro de la organización.",
        "Todos los colaboradores contratados de forma indefinida tienen derecho a un feriado anual de 15 días hábiles remunerados por cada año de servicio completo.",
        "Las solicitudes deben realizarse con un mínimo de 15 días de anticipación utilizando la plataforma de RRHH y contar con el visto bueno del jefe inmediato.",
        "Permisos especiales remunerados:",
        "• Matrimonio/Acuerdo de Unión Civil: 5 días hábiles continuos.",
        "• Nacimiento de hijo: 5 días hábiles pagados (para el padre).",
        "• Fallecimiento de familiar directo: 3 a 7 días dependiendo del grado de consanguinidad."
      ]
    }
  },
  {
    id: "d-5",
    name: "Reporte de gastos Q1.xlsx",
    type: "excel",
    folderId: "f-facturas",
    tags: ["finanzas", "trimestral"],
    size: 215_700,
    createdAt: "2025-04-05T09:30:00.000Z",
    description: "Desglose financiero y reporte de gastos consolidado del primer trimestre de 2025.",
    mockContent: {
      sheetName: "Resumen de Gastos Q1",
      headers: ["Categoría", "Enero ($)", "Febrero ($)", "Marzo ($)", "Total ($)", "Variación (%)"],
      rows: [
        ["Servidores e Infraestructura", 380000, 410000, 450000, 1240000, 18.4],
        ["Licencias de Software", 125000, 125000, 150000, 400000, 20.0],
        ["Oficina y Suministros", 85000, 92000, 78000, 255000, -8.2],
        ["Marketing y Publicidad", 520000, 480000, 610000, 1610000, 17.3],
        ["Sueldos y Honorarios", 4500000, 4500000, 4700000, 13700000, 4.4],
        ["Transporte y Viáticos", 62000, 43000, 89000, 194000, 43.5]
      ],
      totals: ["Total Consolidado", 5672000, 5650000, 6077000, 17399000, 7.1]
    }
  },
  {
    id: "d-6",
    name: "Acuerdo de confidencialidad.pdf",
    type: "pdf",
    folderId: "f-legal",
    tags: ["importante", "firmado"],
    size: 312_400,
    createdAt: "2025-02-11T14:15:00.000Z",
    description: "Acuerdo de confidencialidad estándar (NDA) para proveedores y colaboradores externos.",
    mockContent: {
      title: "ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN (NDA)",
      code: "NDA-LEGAL-2025",
      sections: [
        {
          title: "1. INFORMACIÓN CONFIDENCIAL",
          text: "Toda información técnica, financiera, comercial o de desarrollo revelada por una parte (Divulgadora) a la otra (Receptora) será tratada como estrictamente confidencial."
        },
        {
          title: "2. OBLIGACIONES DE NO DIVULGACIÓN",
          text: "La parte Receptora se compromete a no divulgar, copiar, duplicar ni utilizar dicha información confidencial para ningún fin ajeno a la relación comercial entablada."
        },
        {
          title: "3. EXCEPCIONES",
          text: "No se considerará información confidencial aquella que sea de dominio público, que ya estuviese en posesión legítima de la parte Receptora o que sea requerida por orden judicial."
        }
      ],
      signatures: ["Firma Empresa", "Firma Colaborador / Proveedor"]
    }
  },
  {
    id: "d-7",
    name: "Banner campaña verano.jpg",
    type: "image",
    folderId: "f-marketing",
    tags: ["campaña"],
    size: 1_204_800,
    createdAt: "2025-05-18T11:05:00.000Z",
    description: "Banner promocional para la campaña publicitaria de verano.",
    mockContent: {
      gradient: "linear-gradient(135deg, #e9c46a 0%, #f4a261 50%, #e76f51 100%)",
      dimensions: "1920 x 1080 px",
      colorPalette: ["#e9c46a", "#f4a261", "#e76f51"],
      svgLogo: false
    }
  },
  {
    id: "d-8",
    name: "Nómina abril.xlsx",
    type: "excel",
    folderId: "f-rrhh",
    tags: ["confidencial", "finanzas"],
    size: 98_600,
    createdAt: "2025-04-28T07:50:00.000Z",
    description: "Nómina detallada de sueldos liquidados para el personal administrativo correspondiente al mes de Abril.",
    mockContent: {
      sheetName: "Liquidaciones Abril 2025",
      headers: ["Empleado", "RUT", "Sueldo Base ($)", "Imponentes ($)", "Descuentos ($)", "Líquido a Pago ($)"],
      rows: [
        ["Juan Pérez Gómez", "15.684.930-4", 1200000, 240000, 180000, 1260000],
        ["Ana María Silva", "16.732.115-9", 1450000, 290000, 217500, 1522500],
        ["Carlos Muñoz Ruiz", "14.930.582-1", 1100000, 220000, 165000, 1155000],
        ["María José Castro", "18.330.402-2", 950000, 190000, 142500, 997500],
        ["Roberto Diaz Soto", "12.842.110-K", 1800000, 360000, 270000, 1890000]
      ],
      totals: ["Total Nómina", "", 6500000, 1300000, 975000, 6825000]
    }
  },
  {
    id: "d-9",
    name: "Términos y condiciones.pdf",
    type: "pdf",
    folderId: "f-legal",
    tags: ["público"],
    size: 156_300,
    createdAt: "2025-03-22T13:40:00.000Z",
    description: "Términos y condiciones de uso para la plataforma web y servicios de la empresa.",
    mockContent: {
      title: "TÉRMINOS Y CONDICIONES DE SERVICIO",
      code: "TC-V1.0",
      sections: [
        {
          title: "1. ACEPTACIÓN DE TÉRMINOS",
          text: "Al acceder y utilizar este sitio web y los servicios provistos, usted acepta estar sujeto a estos términos y condiciones en su totalidad."
        },
        {
          title: "2. PROPIEDAD INTELECTUAL",
          text: "Todo el contenido, marcas registradas, códigos y diseños presentes en la plataforma son propiedad exclusiva de la Empresa y están protegidos por leyes nacionales e internacionales."
        },
        {
          title: "3. LIMITACIÓN DE RESPONSABILIDAD",
          text: "El servicio se proporciona 'tal cual'. En ningún caso seremos responsables por daños directos, indirectos o incidentales que surjan del uso o la imposibilidad de uso del software."
        }
      ],
      signatures: ["Aprobado por el Directorio Legal"]
    }
  },
  {
    id: "d-10",
    name: "Contrato laboral - plantilla.docx",
    type: "word",
    folderId: "f-contratos",
    tags: ["plantilla"],
    size: 72_100,
    createdAt: "2025-01-08T15:20:00.000Z",
    description: "Plantilla oficial de contrato de trabajo de plazo indefinido según la legislación chilena vigente.",
    mockContent: {
      title: "CONTRATO DE TRABAJO INDEFINIDO - PLANTILLA",
      version: "PL-RRHH-001",
      body: [
        "En Santiago, a [Día] de [Mes] de [Año], entre la empresa [Nombre Empresa], representada por [Representante], y Don/Doña [Nombre Trabajador], de nacionalidad [Nacionalidad], RUT [RUT].",
        "El trabajador se compromete a prestar sus servicios como [Nombre del Cargo] en las dependencias de la empresa.",
        "La jornada de trabajo será de [Número] horas semanales distribuidas de lunes a viernes.",
        "La remuneración del trabajador consistirá en un sueldo base de $ [Monto Sueldo Base] pagados mensualmente.",
        "El presente contrato es de plazo indefinido, comenzando sus servicios el día [Fecha Inicio]."
      ]
    }
  },
]
