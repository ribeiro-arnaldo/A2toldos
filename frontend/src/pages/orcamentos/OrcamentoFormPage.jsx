import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilePlus, FiSave, FiXCircle, FiLoader } from "react-icons/fi";
import api from "../../api/api";
import toast from "react-hot-toast";
import OrcamentoForm from "../../components/orcamentos/OrcamentoForm";

const OrcamentoFormPage = () => {
  const navigate = useNavigate();

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [prazoEntrega, setPrazoEntrega] = useState(''); 
  const [itens, setItens] = useState([{ id: null, descricao_item: '', cor: '', observacoes: '', largura: '', comprimento: '', preco_m2: '', subtotal: 0 }]);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const valorTotal = useMemo(() => {
    return itens.reduce((total, item) => total + (item.subtotal || 0), 0);
  }, [itens]);

  const validateForm = () => {
    const newErrors = {};
    if (!clienteSelecionado) newErrors.cliente_id = "A seleção de um cliente é obrigatória.";
    if (!descricao.trim()) newErrors.descricao = "A descrição geral é obrigatória.";
    if (prazoEntrega) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataPrazo = new Date(prazoEntrega + 'T00:00:00');
      if (dataPrazo < hoje) {
        newErrors.prazo_entrega = 'O prazo não pode ser no passado.';
      }
    }
    const itensErrors = [];
    itens.forEach((item, index) => {
      const itemError = {};
      if (!item.descricao_item.trim()) itemError.descricao_item = "Obrigatório.";
      if (!item.largura || parseFloat(item.largura) <= 0) itemError.largura = "Obrigatório.";
      if (!item.comprimento || parseFloat(item.comprimento) <= 0) itemError.comprimento = "Obrigatório.";
      if (!item.preco_m2 || parseFloat(item.preco_m2) <= 0) itemError.preco_m2 = "Obrigatório.";
      if (Object.keys(itemError).length > 0) itensErrors[index] = itemError;
    });
    if (itensErrors.length > 0) newErrors.itens = itensErrors;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }
    setLoading(true);
    const payload = {
      cliente_id: clienteSelecionado.id,
      descricao: descricao,
      prazo_entrega: prazoEntrega || null,
      itens: itens.map((item) => ({
        descricao_item: item.descricao_item,
        cor: item.cor,
        observacoes: item.observacoes,
        largura: parseFloat(item.largura),
        comprimento: parseFloat(item.comprimento),
        preco_m2: parseFloat(item.preco_m2),
      })),
    };
    try {
      await api.post("/orcamentos", payload);
      toast.success("Orçamento cadastrado com sucesso!");
      navigate("/orcamentos", { state: { refresh: true } });
    } catch (error) {
      const errorMessage = error.response?.data?.erro || error.response?.data?.errors?.[0]?.msg || "Ocorreu um erro desconhecido.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number" || isNaN(value)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-brand-blue mb-6 flex items-center">
        <FiFilePlus className="mr-3" />
        Criar Novo Orçamento
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg" noValidate>
        <OrcamentoForm
          formData={{ clienteSelecionado, descricao, prazo_entrega: prazoEntrega, itens }}
          setFormData={{ setClienteSelecionado, setDescricao, setPrazoEntrega, setItens }}
          errors={errors}
        />
        {errors.api && (
          <div className="p-3 my-4 text-center text-sm text-red-800 bg-red-100 rounded-lg">
            {errors.api}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700">
              Valor Total do Orçamento
            </label>
            <div className="mt-1 p-3 h-[48px] flex items-center bg-gray-200 rounded-md text-xl font-bold text-gray-900">
              {formatCurrency(valorTotal)}
            </div>
          </div>
        </div>
        <div className="pt-8 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate("/orcamentos")} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center hover:bg-gray-300 transition-colors">
            <FiXCircle className="mr-2" />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="w-48 bg-brand-blue text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
            {loading ? (<FiLoader className="animate-spin mr-2" />) : (<FiSave className="mr-2" />)}
            {loading ? "Salvando..." : "Salvar Orçamento"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrcamentoFormPage;