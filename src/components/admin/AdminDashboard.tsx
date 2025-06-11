import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  CogIcon,
  PlusIcon,
  ListBulletIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon,
  UserGroupIcon,
  ClockIcon,
  CubeIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  ArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { FormIncome } from "./forms/FormIncome";
import ClientsCreate from "@/pages/tenant/clients/ClientsCreate";
import ServiceCreate from "@/pages/tenant/service/ServiceCreate";
import { TableClients } from "@/pages/tenant/clients/TableClients";
import { TableServices } from "@/pages/tenant/service/TableServices";
import MovementsCreate from "@/pages/tenant/movenment/MovementsCreate";
import { TableMovements } from "@/pages/tenant/movenment/TableMovements";
import { TableVehicles } from "@/pages/tenant/vehicle/TableVehicles";
import VehiclesCreate from "@/pages/tenant/vehicle/VehiclesCreate";
import ProductsCreate from "@/pages/tenant/product/ProductsCreate";
import { TableProducts } from "@/pages/tenant/product/tableProducts/TableProducts";
import SupplierCreate from "@/pages/tenant/supplier/SupplierCreate";
import { TableSuppliers } from "@/pages/tenant/supplier/TableSuppliers";
import PurchaseOrderCreate from "@/pages/tenant/purchaseOrder/PurchaseOrderCreate";
import { TablePurchaseOrders } from "@/pages/tenant/purchaseOrder/TablePurchaseOrders";
import ExpenseCreate from "@/pages/expense/ExpenseCreate";

type Action = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
};

type Model = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  actions: Action[];
  color?: string;
};

type Section = {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  models: Model[];
};

// Componentes para cada acción
const ListarVehiculos = () => <h1>Tabla con todos los vehículos</h1>;
const ListarClientes = () => <h1>Tabla con todos los clientes</h1>;

const AdminDashboard = () => {
  const sections: Section[] = [
    {
      id: "section-operaciones",
      name: "Operaciones",
      models: [
        {
          id: "model-ingresos",
          name: "Ingresos",
          icon: CreditCardIcon,
          color: "text-green-500",
          actions: [
            {
              id: "action-crear-ingreso",
              name: "Crear",
              icon: PlusIcon,
              component: FormIncome,
            },
          ],
        },
        {
          id: "model-egresos",
          name: "Gastos",
          icon: ArrowDownIcon,
          color: "text-red-500",
          actions: [
            {
              id: "action-create-expenses",
              name: "Crear",
              icon: PlusIcon,
              component: ExpenseCreate,
            },
          ],
        },
      ],
    },
    {
      id: "section-services",
      name: "Servicios",
      models: [
        {
          id: "model-services",
          name: "Servicios",
          icon: SparklesIcon,
          color: "text-esmerald-500",
          actions: [
            {
              id: "action-create-services",
              name: "Crear",
              icon: PlusIcon,
              component: ServiceCreate,
            },
            {
              id: "action-list-services",
              name: "Listar",
              icon: ListBulletIcon,
              component: TableServices,
            },
          ],
        },
      ],
    },
    {
      id: "section-inventario",
      name: "Inventario",
      models: [
        {
          id: "model-purchaseOrders",
          name: "Ordenes de Compra",
          icon: DocumentTextIcon,
          color: "text-cyan-500",
          actions: [
            {
              id: "action-purchaseOrders-create",
              name: "Crear",
              icon: PlusIcon,
              component: PurchaseOrderCreate,
            },
            {
              id: "action-list-purchaseOrders",
              name: "Listar",
              icon: ListBulletIcon,
              component: TablePurchaseOrders,
            },
          ],
        },
        {
          id: "model-products",
          name: "Productos",
          icon: CubeIcon,
          color: "text-blue-500",
          actions: [
            {
              id: "action-product-create",
              name: "Crear",
              icon: PlusIcon,
              component: ProductsCreate,
            },
            {
              id: "action-list-products",
              name: "Listar",
              icon: ListBulletIcon,
              component: TableProducts,
            },
          ],
        },
        {
          id: "model-proveedores",
          name: "Proveedores",
          icon: BuildingStorefrontIcon,
          color: "text-rose-500",
          actions: [
            {
              id: "action-create-suppliers",
              name: "Crear",
              icon: PlusIcon,
              component: SupplierCreate,
            },
            {
              id: "action-list-suppliers",
              name: "Listar",
              icon: ListBulletIcon,
              component: TableSuppliers,
            },
          ],
        },
      ],
    },
    {
        id: "section-clientes",
        name: "Clientes",
        models: [
          {
            id: "model-clientes",
            name: "Clientes",
            icon: UserIcon,
            color: "text-blue-500",
            actions: [
              {
                id: "action-create-clients",
                name: "Crear",
                icon: PlusIcon,
                component:ClientsCreate,
              },
              {
                id: "action-list-clients",
                name: "Listar",
                icon: ListBulletIcon,
                component: TableClients,
              },
              
            ],
          },
          {
            id: "model-vehiculos",
            name: "Vehículos",
            icon: TruckIcon,
            color: "text-orange-500",
            actions: [
              {
                id: "action-create-vehicles",
                name: "Crear",
                icon: PlusIcon,
                component: VehiclesCreate,
              },
              {
                id: "action-list-vehicles",
                name: "Listar",
                icon: ListBulletIcon,
                component: TableVehicles,
              },
            ],
          },
        ],
      },
      {
        id: "section-empleados",
        name: "Empleados",
        models: [
          {
            id: "model-empleados",
            name: "Empleados",
            icon: UserGroupIcon,
            color: "text-violet-500",
            actions: [
              {
                id: "action-listar-empleados",
                name: "Listar",
                icon: ListBulletIcon,
                component: ListarClientes,
              },
            ],
          },
          {
            id: "model-asistencia",
            name: "Asistencia",
            icon: ClockIcon,
            color: "text-yellow-500",
            actions: [
              {
                id: "action-listar-asistencia",
                name: "Listar",
                icon: ListBulletIcon,
                component: ListarVehiculos,
              },
            ],
          },
        ],
      },
      {
        id: "section-finanze",
        name: "Finanzas",
        models: [
          {
            id: "model-movement",
            name: "Movimientos",
            icon: UserGroupIcon,
            color: "text-emerald-500",
            actions: [
              {
                id: "action-create-movement",
                name: "Crear",
                icon: ListBulletIcon,
                component: MovementsCreate,
              },
              {
                id: "action-list-movements",
                name: "Listar",
                icon: ListBulletIcon,
                component: TableMovements,
              },
            ],
          },
        ],
      },
  ];

  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Encontrar la acción seleccionada basada en su ID
  const selectedAction =
    sections
      .flatMap((section) => section.models.flatMap((model) => model.actions))
      .find((action) => action.id === selectedActionId) || null;

  // Encontrar el modelo actual basado en la acción seleccionada
  const currentModel = selectedAction
    ? sections
        .flatMap((section) => section.models)
        .find((model) =>
          model.actions.some((action) => action.id === selectedAction.id)
        )
    : null;

  // Encontrar la sección actual basada en el modelo seleccionado
  const currentSection = currentModel
    ? sections.find((section) =>
        section.models.some((model) => model.id === currentModel.id)
      )
    : null;

  useEffect(() => {
    // Seleccionar la primera acción disponible al cargar el componente
    if (sections.length > 0 && sections[0].models.length > 0 && sections[0].models[0].actions.length > 0) {
      setSelectedActionId(sections[0].models[0].actions[0].id);
    }
  }, []);

  const handleActionSelect = (actionId: string) => {
    setSelectedActionId(actionId);
    setMobileMenuOpen(false); // Cerrar menú en móvil al seleccionar
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Botón de menú móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transform fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-800 text-gray-300 p-4 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <h1 className="text-xl font-bold text-white mb-8 px-2">
          Panel de Administración
        </h1>
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1">
              <h2 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.name}
              </h2>
              {section.models.map((model) => (
                <Disclosure
                  key={model.id}
                  defaultOpen={model.actions.some((a) => a.id === selectedActionId)}
                >
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentModel?.id === model.id
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <model.icon
                            className={`h-5 w-5 mr-3 ${
                              model.color || "text-gray-400"
                            }`}
                          />
                          <span>{model.name}</span>
                        </div>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="ml-8 mt-1 space-y-1">
                        {model.actions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleActionSelect(action.id)}
                            className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                              selectedActionId === action.id
                                ? "bg-blue-900 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                            }`}
                          >
                            <action.icon className="h-4 w-4 mr-3" />
                            {action.name}
                          </button>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center px-3 py-2 text-sm text-gray-400">
            <CogIcon className="h-5 w-5 mr-3" />
            <span>Configuración</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentSection && currentModel && selectedAction
                ? `${currentSection.name} > ${currentModel.name} > ${selectedAction.name}`
                : "Selecciona una acción"}
            </h2>
          </div>
        </header>

        {/* Panel de contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {selectedAction ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4 bg-white rounded-lg shadow">
                <selectedAction.component />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                Selecciona una acción del menú lateral
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;