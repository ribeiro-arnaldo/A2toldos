import React, { useState, useEffect } from 'react';
import { FiUser, FiList, FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
import api from '../../api/api';

const OrcamentoForm = ({ formData, setFormData, errors }) => {
  const { clienteSelecionado, descricao, itens } = formData;
  const { setClienteSelecionado, setDescricao, setItens } = setFormData;

  // Estados locais para o controle do autocomplete
  const [termoBuscaCliente, setTermoBuscaCliente] = useState('');
  const [sugestoesClientes, setSugestoesClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  // Efeito para preencher o campo de busca quando um cliente já vem selecionado (no caso da edição)
  useEffect(() => {
    if (clienteSelecionado) {
      setTermoBuscaCliente(clienteSelecionado.nome);
    }
  }, [clienteSelecionado]);
  
  // Efeito para a busca com "debounce"
  useEffect(() => {
    if (!termoBuscaCliente.trim() || clienteSelecionado) {
      setSugestoesClientes([]);
      return;
    }
    setLoadingClientes(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await api.get(`/clientes?nome=${termoBuscaCliente}&limite=10`);
        setSugestoesClientes(response.data.clientes);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [termoBuscaCliente, clienteSelecionado]);

  const handleClienteSearchChange = (e) => {
    setTermoBuscaCliente(e.target.value);
    if (clienteSelecionado) {
      setClienteSelecionado(null);
    }
  };

  const handleClienteSelect = (cliente) => {
    setClienteSelecionado(cliente);
    setTermoBuscaCliente(cliente.nome);
    setSugestoesClientes([]);
  };

  const handleItemChange = (index, event) => {
    const novosItens = [...itens];
    let value = event.target.value;
    if (event.target.name !== 'descricao_item') {
      value = value.replace(/[^0-9.]/g, '');
    }
    novosItens[index][event.target.name] = value;
    const item = novosItens[index];
    const largura = parseFloat(item.largura);
    const comprimento = parseFloat(item.comprimento);
    const preco_m2 = parseFloat(item.preco_m2);
    novosItens[index].subtotal = (largura > 0 && comprimento > 0 && preco_m2 > 0) 
      ? largura * comprimento * preco_m2 
      : 0;
    setItens(novosItens);
  };

  const addItem = () => {
    setItens([...itens, { id: null, descricao_item: '', largura: '', comprimento: '', preco_m2: '', subtotal: 0 }]);
  };

  const removeItem = (index) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FiUser className="mr-2" />Dados do Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="cliente_busca" className="block text-sm font-medium text-gray-700">Buscar Cliente</label>
            <input type="text" id="cliente_busca" value={termoBuscaCliente} onChange={handleClienteSearchChange} className={`mt-1 block w-full form-input ${errors.cliente_id ? 'border-red-500' : 'border-gray-300'}`} placeholder="Digite o nome do cliente..." autoComplete="off" disabled={!!clienteSelecionado} />
            {clienteSelecionado && (<button type="button" onClick={() => { setClienteSelecionado(null); setTermoBuscaCliente(''); }} className="absolute top-7 right-2 p-1 text-gray-500 hover:text-red-600"><FiXCircle/></button>)}
            {loadingClientes && <p className="text-sm text-gray-500 mt-1">Buscando...</p>}
            {sugestoesClientes.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                {sugestoesClientes.map(cliente => (<li key={cliente.id} onClick={() => handleClienteSelect(cliente)} className="px-4 py-2 hover:bg-brand-yellow cursor-pointer">{cliente.nome}</li>))}
              </ul>
            )}
            {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>}
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição Geral do Orçamento</label>
            <input type="text" id="descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className={`mt-1 block w-full form-input ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: Cobertura da área da piscina" />
            {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
          </div>
        </div>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FiList className="mr-2" /> Itens do Orçamento</h2>
        <div className="space-y-4">
          {itens.map((item, index) => (
            <div key={item.id || index} className="flex flex-wrap items-start gap-4 p-3 border-b">
              <div className="pt-8 font-bold text-lg text-gray-500">{index + 1}.</div>
              <div className="flex-grow min-w-[200px]"><label className="block text-sm font-medium text-gray-700">Descrição do Item</label><input type="text" name="descricao_item" value={item.descricao_item} onChange={e => handleItemChange(index, e)} className={`mt-1 w-full form-input ${errors.itens?.[index]?.descricao_item ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: Toldo Fixo" />{errors.itens?.[index]?.descricao_item && <p className="mt-1 text-sm text-red-600">{errors.itens[index].descricao_item}</p>}</div>
              <div className="w-24"><label className="block text-sm font-medium text-gray-700">Largura (m)</label><input type="text" name="largura" value={item.largura} onChange={e => handleItemChange(index, e)} className={`mt-1 w-full form-input ${errors.itens?.[index]?.largura ? 'border-red-500' : 'border-gray-300'}`} placeholder="4.50" />{errors.itens?.[index]?.largura && <p className="mt-1 text-sm text-red-600">{errors.itens[index].largura}</p>}</div>
              <div className="w-24"><label className="block text-sm font-medium text-gray-700">Compr. (m)</label><input type="text" name="comprimento" value={item.comprimento} onChange={e => handleItemChange(index, e)} className={`mt-1 w-full form-input ${errors.itens?.[index]?.comprimento ? 'border-red-500' : 'border-gray-300'}`} placeholder="3.00" />{errors.itens?.[index]?.comprimento && <p className="mt-1 text-sm text-red-600">{errors.itens[index].comprimento}</p>}</div>
              <div className="w-28"><label className="block text-sm font-medium text-gray-700">Preço/m² (R$)</label><input type="text" name="preco_m2" value={item.preco_m2} onChange={e => handleItemChange(index, e)} className={`mt-1 w-full form-input ${errors.itens?.[index]?.preco_m2 ? 'border-red-500' : 'border-gray-300'}`} placeholder="250.00" />{errors.itens?.[index]?.preco_m2 && <p className="mt-1 text-sm text-red-600">{errors.itens[index].preco_m2}</p>}</div>
              <div className="w-32"><label className="block text-sm font-medium text-gray-700">Subtotal (R$)</label><div className="mt-1 px-3 py-2 h-[42px] flex items-center bg-gray-100 rounded-md font-semibold text-gray-800">{formatCurrency(item.subtotal)}</div></div>
              <div className="pt-6"><button type="button" onClick={() => removeItem(index)} disabled={itens.length <= 1} className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"><FiTrash2 size={20} /></button></div>
            </div>
          ))}
        </div>
        <div className="mt-4"><button type="button" onClick={addItem} className="flex items-center text-sm font-semibold text-brand-blue hover:text-opacity-80"><FiPlusCircle className="mr-2" />Adicionar outro item</button></div>
      </div>
    </div>
  );
};

export default OrcamentoForm;