import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap
} from 'lucide-react';
import { AcademyInvoice, AcademyProfile, PaymentMethod, Player } from '../types';

interface SubscriptionManagementTabProps {
  academy: AcademyProfile;
  players: Player[];
  onUpdateAcademy: (updated: AcademyProfile) => void;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    cardBrand: 'visa',
    last4: '4242',
    cardHolderName: 'Lic. Rafael Almonte Pérez',
    expMonth: '11',
    expYear: '28',
    isDefault: true,
    bankOrIssuer: 'Banco BHD León Corporativo',
  },
  {
    id: 'pm-2',
    cardBrand: 'mastercard',
    last4: '8810',
    cardHolderName: 'Caribe Baseball Academy SRL',
    expMonth: '08',
    expYear: '27',
    isDefault: false,
    bankOrIssuer: 'Banco Popular Dominicano',
  },
];

const DEFAULT_INVOICES: AcademyInvoice[] = [
  {
    id: 'inv-2025-01',
    invoiceNumber: 'INV-GLV-2025-0891',
    date: '15 de Diciembre, 2025',
    planName: 'Glovall Academy Pro (25 Asientos Anual)',
    amount: 1440,
    currency: 'USD',
    status: 'paid',
    billingPeriod: '15 Dic 2025 - 15 Dic 2026',
    paymentMethodLast4: '4242',
  },
  {
    id: 'inv-2024-01',
    invoiceNumber: 'INV-GLV-2024-0412',
    date: '15 de Diciembre, 2024',
    planName: 'Glovall Academy Pro (25 Asientos Anual)',
    amount: 1440,
    currency: 'USD',
    status: 'paid',
    billingPeriod: '15 Dic 2024 - 15 Dic 2025',
    paymentMethodLast4: '4242',
  },
];

export const SubscriptionManagementTab: React.FC<SubscriptionManagementTabProps> = ({
  academy,
  players,
  onUpdateAcademy,
}) => {
  // State for Payment Methods
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>(
    academy.paymentMethods || DEFAULT_PAYMENT_METHODS
  );

  // State for Invoices
  const [invoices, setInvoices] = React.useState<AcademyInvoice[]>(
    academy.invoices || DEFAULT_INVOICES
  );

  // State for Auto-renewal toggle
  const [autoRenew, setAutoRenew] = React.useState<boolean>(academy.autoRenew ?? true);

  // State for Renewal Simulator Modal
  const [isRenewalModalOpen, setIsRenewalModalOpen] = React.useState(false);
  const [selectedPlanOption, setSelectedPlanOption] = React.useState<string>(
    academy.subscriptionPlan || 'Glovall Academy Pro (B2B Multi-Staff)'
  );
  const [billingCycle, setBillingCycle] = React.useState<'annual' | 'monthly'>('annual');
  const [additionalSeats, setAdditionalSeats] = React.useState<number>(0);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string>(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id || ''
  );
  const [isProcessingRenewal, setIsProcessingRenewal] = React.useState(false);
  const [renewalSuccessMessage, setRenewalSuccessMessage] = React.useState<string | null>(null);

  // State for Add Card Modal
  const [isAddCardModalOpen, setIsAddCardModalOpen] = React.useState(false);
  const [cardHolder, setCardHolder] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExp, setCardExp] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');
  const [cardBank, setCardBank] = React.useState('Banco BHD León');
  const [setAsDefault, setSetAsDefault] = React.useState(true);

  // State for Invoice Receipt Modal
  const [selectedInvoiceForView, setSelectedInvoiceForView] = React.useState<AcademyInvoice | null>(
    null
  );

  // Helper to detect card brand from number
  const detectBrand = (num: string): 'visa' | 'mastercard' | 'amex' => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'mastercard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'amex';
    return 'visa';
  };

  // Format credit card with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiration date MM/YY
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      setCardExp(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExp(value);
    }
  };

  // Handler: Add New Card
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 13 || !cardHolder || !cardExp) return;

    const brand = detectBrand(cleanNumber);
    const last4 = cleanNumber.slice(-4);
    const [expMonth, expYear] = cardExp.includes('/') ? cardExp.split('/') : ['12', '28'];

    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      cardBrand: brand,
      last4: last4 || '9999',
      cardHolderName: cardHolder.trim(),
      expMonth: expMonth.trim(),
      expYear: expYear.trim(),
      isDefault: setAsDefault || paymentMethods.length === 0,
      bankOrIssuer: cardBank.trim() || 'Banco Emisor',
    };

    let updatedMethods = [...paymentMethods];
    if (newMethod.isDefault) {
      updatedMethods = updatedMethods.map((m) => ({ ...m, isDefault: false }));
    }
    updatedMethods.push(newMethod);

    setPaymentMethods(updatedMethods);
    onUpdateAcademy({
      ...academy,
      paymentMethods: updatedMethods,
    });

    // Reset and close
    setCardHolder('');
    setCardNumber('');
    setCardExp('');
    setCardCvc('');
    setIsAddCardModalOpen(false);
  };

  // Handler: Set Card as Default
  const handleSetDefaultCard = (id: string) => {
    const updated = paymentMethods.map((m) => ({
      ...m,
      isDefault: m.id === id,
    }));
    setPaymentMethods(updated);
    onUpdateAcademy({
      ...academy,
      paymentMethods: updated,
    });
  };

  // Handler: Delete Card
  const handleDeleteCard = (id: string) => {
    if (paymentMethods.length <= 1) {
      alert('Debes mantener al menos un método de pago registrado para la facturación activa.');
      return;
    }
    if (window.confirm('¿Deseas eliminar esta tarjeta de crédito de la academia?')) {
      const updated = paymentMethods.filter((m) => m.id !== id);
      if (!updated.some((m) => m.isDefault) && updated.length > 0) {
        updated[0].isDefault = true;
      }
      setPaymentMethods(updated);
      onUpdateAcademy({
        ...academy,
        paymentMethods: updated,
      });
    }
  };

  // Handler: Toggle Auto-renew
  const handleToggleAutoRenew = (val: boolean) => {
    setAutoRenew(val);
    onUpdateAcademy({
      ...academy,
      autoRenew: val,
    });
  };

  // Calculate pricing for Renewal Simulator
  const baseMonthlyPrice = 150;
  const baseAnnualPrice = 1440; // $120/mo
  const seatMonthlyPrice = 8;
  const seatAnnualPrice = 80;

  const currentSeats = (academy.licensedPlayersSeats || 25) + additionalSeats;
  const totalAmount =
    billingCycle === 'annual'
      ? baseAnnualPrice + additionalSeats * seatAnnualPrice
      : baseMonthlyPrice + additionalSeats * seatMonthlyPrice;

  // Handler: Execute Renewal Simulation
  const handleConfirmRenewal = () => {
    setIsProcessingRenewal(true);
    setTimeout(() => {
      setIsProcessingRenewal(false);
      setIsRenewalModalOpen(false);

      const nextYearDate = '15 de Diciembre, 2027';
      const selectedPm = paymentMethods.find((p) => p.id === selectedPaymentMethodId) || paymentMethods[0];

      const newInvoice: AcademyInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-GLV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Hoy, 19 de Agosto, 2026',
        planName: `${selectedPlanOption} (${currentSeats} Asientos ${billingCycle === 'annual' ? 'Anual' : 'Mensual'})`,
        amount: totalAmount,
        currency: 'USD',
        status: 'paid',
        billingPeriod: `15 Dic 2026 - ${nextYearDate}`,
        paymentMethodLast4: selectedPm?.last4 || '4242',
      };

      const updatedInvoices = [newInvoice, ...invoices];
      setInvoices(updatedInvoices);

      onUpdateAcademy({
        ...academy,
        subscriptionPlan: selectedPlanOption,
        subscriptionStatus: 'active',
        nextBillingDate: nextYearDate,
        licensedPlayersSeats: currentSeats,
        invoices: updatedInvoices,
      });

      setRenewalSuccessMessage(
        `¡Suscripción renovada con éxito por $${totalAmount.toLocaleString()} USD! Nueva fecha de vencimiento: ${nextYearDate}`
      );
      setTimeout(() => setRenewalSuccessMessage(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Renewal Success Banner */}
      {renewalSuccessMessage && (
        <div className="p-4 bg-emerald-500 text-white text-xs rounded-2xl font-bold flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in slide-in-from-top">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{renewalSuccessMessage}</span>
          </div>
          <span className="text-[10px] bg-emerald-600/70 px-2.5 py-1 rounded-full uppercase font-black">
            Factura Generada
          </span>
        </div>
      )}

      {/* 2. Main Subscription Hero Card with Action Buttons */}
      <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center font-bold">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black text-amber-400 tracking-wider">
                  Plan Institucional Activo
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  Vigente
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                {academy.subscriptionPlan}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRenewalModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renovar / Mejorar Plan</span>
            </button>
          </div>
        </div>

        {/* Plan Capacity & Seats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Cupo de Atletas Licenciados
            </p>
            <p className="text-xl font-black text-blue-400 mt-1">
              {players.length} / {academy.licensedPlayersSeats || 25} Asientos
            </p>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full"
                style={{
                  width: `${Math.min(100, (players.length / (academy.licensedPlayersSeats || 25)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Próxima Facturación / Renovación
            </p>
            <p className="text-xl font-black text-white mt-1">{academy.nextBillingDate}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Ciclo Anual (Ahorro del 20%)</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Renovación Automática
              </p>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                {autoRenew ? 'Activa con cargo a tarjeta principal' : 'Manual (Aviso preventivo 15 días)'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => handleToggleAutoRenew(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">
                {autoRenew ? 'Habilitada' : 'Pausada'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Section: Payment Methods & Credit Cards (CRUD) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Métodos de Pago & Tarjetas de Crédito de la Academia</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administra las tarjetas corporativas registradas para el cobro de licencias y servicios de scouting.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Nueva Tarjeta</span>
          </button>
        </div>

        {/* Credit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-5 rounded-2xl border transition-all relative ${
                method.isDefault
                  ? 'bg-gradient-to-br from-slate-900 to-blue-950 text-white border-blue-900 shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {method.cardBrand === 'visa' && (
                    <span className="font-black text-lg italic tracking-wider px-2 py-0.5 rounded bg-white text-blue-900">
                      VISA
                    </span>
                  )}
                  {method.cardBrand === 'mastercard' && (
                    <div className="flex items-center -space-x-1.5 px-2 py-1 rounded bg-white">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-500 block" />
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500 block" />
                    </div>
                  )}
                  {method.cardBrand === 'amex' && (
                    <span className="font-black text-xs px-2 py-1 rounded bg-blue-600 text-white font-mono">
                      AMEX
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-semibold ${
                      method.isDefault ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {method.bankOrIssuer}
                  </span>
                </div>

                {method.isDefault ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Predeterminada
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultCard(method.id)}
                    className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Hacer Predeterminada
                  </button>
                )}
              </div>

              <div className="space-y-1 my-3">
                <p
                  className={`text-base font-mono tracking-widest font-bold ${
                    method.isDefault ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  •••• •••• •••• {method.last4}
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold block ${
                        method.isDefault ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      Titular
                    </span>
                    <span className="font-bold truncate block max-w-[180px]">
                      {method.cardHolderName}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] uppercase font-bold block ${
                        method.isDefault ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      Vence
                    </span>
                    <span className="font-bold font-mono">
                      {method.expMonth}/{method.expYear}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`pt-3 border-t flex items-center justify-between text-xs ${
                  method.isDefault ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-500'
                }`}
              >
                <span className="text-[11px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Cifrado SSL 256-bit
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteCard(method.id)}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Eliminar tarjeta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section: Billing Invoices & Receipts History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Historial de Facturación & Recibos Fiscales
              </h3>
              <p className="text-xs text-slate-500">
                Consulta y descarga los comprobantes de pago emitidos a Caribe Baseball Academy SRL
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">{invoices.length} facturas</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4">No. Factura</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Concepto / Plan</th>
                <th className="py-3 px-4">Periodo Facturado</th>
                <th className="py-3 px-4">Monto (USD)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{inv.planName}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{inv.billingPeriod}</td>
                  <td className="py-3 px-4 font-mono font-black text-slate-900">
                    ${inv.amount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Pagado
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForView(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ver Recibo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: SIMULADOR DE RENOVACIÓN / MEJORA DE PLAN        */}
      {/* ======================================================== */}
      {isRenewalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Simulador de Renovación & Configuración de Licencia
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calcula el monto, añade asientos para atletas y confirma la extensión de vigencia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRenewalModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Frecuencia de Facturación</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    billingCycle === 'annual'
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">Plan Anual</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Ahorra 20%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">$120 USD / mes ($1,440/año)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">Plan Mensual</span>
                    <span className="text-[10px] font-bold text-slate-400">Flexibilidad</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">$150 USD / mes</p>
                </button>
              </div>
            </div>

            {/* Plan Tier Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Nivel de Plan Institucional</label>
              <select
                value={selectedPlanOption}
                onChange={(e) => setSelectedPlanOption(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="Glovall Academy Starter (10 Asientos)">
                  Starter: Hasta 10 Atletas Verificados + Staff Básico
                </option>
                <option value="Glovall Academy Pro (B2B Multi-Staff)">
                  Pro: Hasta 25 Atletas Verificados + Scout Book PDF + TrackMan (Actual)
                </option>
                <option value="Glovall Academy Enterprise Élite (50 Asientos)">
                  Enterprise: Hasta 50 Atletas + Marca Blanca Premium + Biomecánica 3D
                </option>
              </select>
            </div>

            {/* Additional Seats Stepper */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Añadir Asientos Adicionales de Atletas
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Capacidad base: 25 atletas • Total resultante: <strong>{currentSeats} atletas</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdditionalSeats((prev) => Math.max(0, prev - 5))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black font-mono text-xs text-blue-600">
                    +{additionalSeats}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdditionalSeats((prev) => prev + 5)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-sm text-slate-700 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Método de Pago para la Transacción
              </label>
              <div className="space-y-2">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPaymentMethodId === m.id
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethodId === m.id}
                        onChange={() => setSelectedPaymentMethodId(m.id)}
                        className="text-blue-600"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 uppercase">
                          {m.cardBrand} •••• {m.last4}
                        </span>{' '}
                        <span className="text-slate-500">({m.bankOrIssuer})</span>
                      </div>
                    </div>
                    {m.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Predeterminada
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-blue-900 text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-200">
                <span>Plan Base ({billingCycle === 'annual' ? '12 Meses' : '1 Mes'}):</span>
                <span className="font-mono font-bold text-white">
                  ${(billingCycle === 'annual' ? baseAnnualPrice : baseMonthlyPrice).toLocaleString()} USD
                </span>
              </div>
              {additionalSeats > 0 && (
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <span>+{additionalSeats} Asientos de Atletas:</span>
                  <span className="font-mono font-bold text-white">
                    +$
                    {(
                      additionalSeats *
                      (billingCycle === 'annual' ? seatAnnualPrice : seatMonthlyPrice)
                    ).toLocaleString()}{' '}
                    USD
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-blue-800 flex items-center justify-between text-sm font-black">
                <span>Total a Cobrar:</span>
                <span className="text-xl font-mono text-amber-300">
                  ${totalAmount.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRenewalModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRenewal}
                disabled={isProcessingRenewal}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isProcessingRenewal ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Procesando Cobro Seguro...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirmar Renovación (${totalAmount.toLocaleString()} USD)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REGISTRAR NUEVA TARJETA DE CRÉDITO              */}
      {/* ======================================================== */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  Agregar Tarjeta de Crédito Corporativa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Virtual Card Preview (Updates Live) */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Glovall B2B Card
                </span>
                <span className="font-bold text-xs italic tracking-wider font-mono">
                  {cardNumber.startsWith('4')
                    ? 'VISA'
                    : cardNumber.startsWith('5')
                    ? 'MASTERCARD'
                    : cardNumber.startsWith('3')
                    ? 'AMEX'
                    : 'CREDIT'}
                </span>
              </div>
              <p className="font-mono text-base font-bold tracking-widest text-center py-1">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Titular</span>
                  <span className="font-bold truncate max-w-[160px] block">
                    {cardHolder || 'NOMBRE DEL TITULAR'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Vence</span>
                  <span className="font-mono font-bold">{cardExp || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Ej: Lic. Rafael Almonte Pérez"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Número de Tarjeta</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4000 1234 5678 9010"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Expiración (MM/AA)</label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={handleExpChange}
                    placeholder="12/28"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">CVC / Código</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Banco Emisor / Entidad</label>
                <input
                  type="text"
                  value={cardBank}
                  onChange={(e) => setCardBank(e.target.value)}
                  placeholder="Ej: Banco BHD León / Banco Popular"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Establecer como método de pago predeterminado
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VISTA DE RECIBO / FACTURA FISCAL                */}
      {/* ======================================================== */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  Comprobante Fiscal de Pago Oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForView(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
                <div>
                  <p className="font-black text-base text-slate-900">GLOVALL SPORTS TECH INC.</p>
                  <p className="text-[10px] text-slate-500">RNC: 1-31-89021-4 • Santo Domingo, RD</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  PAGADO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-sans">Factura No:</span>
                  <strong>{selectedInvoiceForView.invoiceNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Fecha de Emisión:</span>
                  <strong>{selectedInvoiceForView.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Cliente / Academia:</span>
                  <strong>{academy.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Método de Pago:</span>
                  <strong>Tarjeta terminada en {selectedInvoiceForView.paymentMethodLast4}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="font-sans font-bold text-slate-700 mb-1">Detalle del Servicio:</p>
                <div className="flex items-center justify-between py-1 text-slate-800 font-sans">
                  <span>{selectedInvoiceForView.planName}</span>
                  <span className="font-mono font-bold">
                    ${selectedInvoiceForView.amount.toLocaleString()} {selectedInvoiceForView.currency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  Periodo de cobertura: {selectedInvoiceForView.billingPeriod}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-between font-black text-sm text-slate-900 font-sans">
                <span>TOTAL PAGADO:</span>
                <span className="font-mono">
                  ${selectedInvoiceForView.amount.toLocaleString()}{' '}
                  {selectedInvoiceForView.currency}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Imprimir / Guardar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
