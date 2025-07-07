import React, { useState, useEffect } from 'react';
import { FiUser, FiList, FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi';
import api from '../../api/api';

const OrcamentoForm = ({ formData, setFormData, errors }) => {
  const { clienteSelecionado, descricao, prazo_entrega, itens } = formData;
  const { setClienteSelecionado, setDescricao, setPrazoEntrega, setItens } = setFormData;

  const [termoBuscaCliente, setTermoBuscaCliente] = useState('');
  const [sugestoesClientes, setSugestoesClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  useEffect(() => {
    if (clienteSelecionado) {
      setTermoBuscaCliente(clienteSelecionado.nome);
    }
  }, [clienteSelecionado]);
  
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
    if (['largura', 'comprimento', 'preco_m2'].includes(event.target.name)) {
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
    setItens([...itens, { id: null, descricao_item: '', cor: '', observacoes: '', largura: '', comprimento: '', preco_m2: '', subtotal: 0 }]);
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
  
  const formInputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow";

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FiUser className="mr-2" />Dados Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label htmlFor="cliente_busca" className="block text-sm font-medium text-gray-700">Buscar Cliente*</label>
            <input type="text" id="cliente_busca" value={termoBuscaCliente} onChange={handleClienteSearchChange} className={`${formInputStyle} ${errors.cliente_id ? 'border-red-500' : ''}`} placeholder="Digite o nome do cliente..." autoComplete="off" disabled={!!clienteSelecionado} />
            {clienteSelecionado && (<button type="button" onClick={() => { setClienteSelecionado(null); setTermoBuscaCliente(''); }} className="absolute top-7 right-2 p-1 text-gray-500 hover:text-red-600"><FiXCircle/></button>)}
            {loadingClientes && <p className="text-sm text-gray-500 mt-1">Buscando...</p>}
            {sugestoesClientes.length > 0 && ( <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">{sugestoesClientes.map(cliente => (<li key={cliente.id} onClick={() => handleClienteSelect(cliente)} className="px-4 py-2 hover:bg-brand-yellow cursor-pointer">{cliente.nome}</li>))}</ul> )}
            {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>}
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição Geral*</label>
            <input type="text" id="descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className={`${formInputStyle} ${errors.descricao ? 'border-red-500' : ''}`} placeholder="Ex: Cobertura da área da piscina" />
            {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
          </div>
          <div>
            <label htmlFor="prazo_entrega" className="block text-sm font-medium text-gray-700">Prazo de Entrega</label>
            <input type="date" id="prazo_entrega" name="prazo_entrega" value={prazo_entrega || ''} onChange={(e) => setPrazoEntrega(e.target.value)} className={`${formInputStyle} ${errors.prazo_entrega ? 'border-red-500' : ''}`} />
            {errors.prazo_entrega && <p className="mt-1 text-sm text-red-600">{errors.prazo_entrega}</p>}
          </div>
        </div>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FiList className="mr-2" /> Itens do Orçamento</h2>
        <div className="space-y-4">
          {itens.map((item, index) => (
            <div key={item.id || index} className="grid grid-cols-12 gap-x-4 gap-y-2 items-start p-3 border-b last:border-b-0">
              <div className="col-span-12 sm:col-span-1 pt-8 font-bold text-lg text-gray-500 text-center">{index + 1}.</div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3"><label className="block text-sm font-medium text-gray-700">Descrição do Item*</label><input type="text" name="descricao_item" value={item.descricao_item} onChange={e => handleItemChange(index, e)} className={`${formInputStyle} ${errors.itens?.[index]?.descricao_item ? 'border-red-500' : ''}`} placeholder="Ex: Toldo Fixo" />{errors.itens?.[index]?.descricao_item && <p className="mt-1 text-sm text-red-600">{errors.itens[index].descricao_item}</p>}</div>
              <div className="col-span-12 sm:col-span-5 md:col-span-2"><label className="block text-sm font-medium text-gray-700">Cor</label><input type="text" name="cor" value={item.cor || ''} onChange={e => handleItemChange(index, e)} className={formInputStyle} placeholder="Ex: Azul" /></div>
              <div className="col-span-12 md:col-span-6 grid grid-cols-3 gap-x-4">
                <div><label className="block text-sm font-medium text-gray-700">Largura (m)*</label><input type="text" name="largura" value={item.largura} onChange={e => handleItemChange(index, e)} className={`${formInputStyle} ${errors.itens?.[index]?.largura ? 'border-red-500' : ''}`} placeholder="4.50" />{errors.itens?.[index]?.largura && <p className="mt-1 text-sm text-red-600">{errors.itens[index].largura}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700">Compr. (m)*</label><input type="text" name="comprimento" value={item.comprimento} onChange={e => handleItemChange(index, e)} className={`${formInputStyle} ${errors.itens?.[index]?.comprimento ? 'border-red-500' : ''}`} placeholder="3.00" />{errors.itens?.[index]?.comprimento && <p className="mt-1 text-sm text-red-600">{errors.itens[index].comprimento}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-700">Preço/m² (R$)*</label><input type="text" name="preco_m2" value={item.preco_m2} onChange={e => handleItemChange(index, e)} className={`${formInputStyle} ${errors.itens?.[index]?.preco_m2 ? 'border-red-500' : ''}`} placeholder="250.00" />{errors.itens?.[index]?.preco_m2 && <p className="mt-1 text-sm text-red-600">{errors.itens[index].preco_m2}</p>}</div>
              </div>
              <div className="col-span-12 md:col-span-5"><label className="block text-sm font-medium text-gray-700">Observações</label><input type="text" name="observacoes" value={item.observacoes || ''} onChange={e => handleItemChange(index, e)} className={formInputStyle} placeholder="Ex: Com braço articulado" /></div>
              <div className="col-span-12 md:col-span-2 flex items-end justify-between">
                <div className="w-full"><label className="block text-sm font-medium text-gray-700">Subtotal</label><div className="mt-1 px-3 py-2 h-[42px] flex items-center bg-gray-100 rounded-md font-semibold">{formatCurrency(item.subtotal)}</div></div>
                <button type="button" onClick={() => removeItem(index)} disabled={itens.length <= 1} className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed ml-2 self-end mb-2"><FiTrash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4"><button type="button" onClick={addItem} className="flex items-center text-sm font-semibold text-brand-blue hover:text-opacity-80"><FiPlusCircle className="mr-2" />Adicionar outro item</button></div>
      </div>
    </div>
  );
};

export default OrcamentoForm;