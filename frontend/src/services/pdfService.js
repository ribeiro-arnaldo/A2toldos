import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/LogoA2Toldos.png'; 
import { formatDate, formatarDocumento, formatarTelefone, formatCurrency } from '../utils/formatters';

export const gerarOrcamentoPDF = (orcamento, usuarioLogado) => {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  let currentY = 10;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- CABEÇALHO ---
  doc.addImage(logo, 'PNG', 20, 10, 80, 35);
  const xOffset = 110;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("A2 Toldos e Coberturas", xOffset, currentY + 2);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text("CNPJ: 38.543.770/0001-53", xOffset, currentY + 7);
  doc.text("Rua Aristides Pereira, 15, Itinga", xOffset, currentY + 11);
  doc.text("Lauro de Freitas - BA, 42738-895", xOffset, currentY + 15);
  doc.text("Telefone: (71) 98619-2214", xOffset, currentY + 19);
  doc.text("Email: aa.toldos@hotmail.com", xOffset, currentY + 23);
  currentY += 30;

  // --- INFO ORÇAMENTO ---
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Orçamento nº:", margin + 5, currentY + 5.5);
  doc.text("Emitido em:", 80, currentY + 5.5);
  doc.text("Válido até:", 140, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(orcamento.numero_orcamento, 48, currentY + 5.5);
  doc.text(formatDate(orcamento.data_orcamento), 105, currentY + 5.5);
  const validade = new Date(orcamento.data_orcamento);
  validade.setDate(validade.getDate() + 30);
  doc.text(formatDate(validade.toISOString()), 162, currentY + 5.5);
  currentY += 12;

  // --- INFO CLIENTE ---
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("CLIENTE", margin + 5, currentY + 5.5);
  currentY += 12;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`NOME: ${orcamento.nome_cliente}`, margin + 5, currentY);
  doc.text(`EMAIL: ${orcamento.email_cliente || 'Não informado'}`, 110, currentY);
  currentY += 7;
  const docFormatado = formatarDocumento(orcamento.cliente_documento, orcamento.cliente_tipo_pessoa);
  doc.text(`${orcamento.cliente_tipo_pessoa === 'FISICA' ? 'CPF' : 'CNPJ'}: ${docFormatado}`, margin + 5, currentY);
  doc.text(`TELEFONE: ${formatarTelefone(orcamento.telefone_cliente) || 'Não informado'}`, 110, currentY);
  currentY += 7;
  doc.text(`ENDEREÇO: ${orcamento.cliente_endereco}`, margin + 5, currentY);
  currentY += 10;

  // --- TABELA DE ITENS ---
  doc.setFillColor(230, 230, 230);
  doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("ORÇAMENTO", margin + 5, currentY + 5.5);
  currentY += 8;
  const head = [['Item', 'Produto/Serviço', 'Qtd', 'V. Unit.', 'Total']];
  const body = orcamento.itens.map((item, index) => {
    let descricaoCompleta = item.descricao_item;
    if (item.material) {
        descricaoCompleta += `\nMaterial: ${item.material}`;
    }
    return [
      (index + 1).toString().padStart(2, '0'),
      descricaoCompleta, 1, formatCurrency(item.valor_item), formatCurrency(item.valor_item)
    ];
  });
  autoTable(doc, {
    head: head, body: body, startY: currentY, theme: 'grid',
    margin: { left: margin, right: margin },
    headStyles: { fillColor: [6, 57, 125], textColor: [255, 255, 255] },
    didDrawPage: (data) => { currentY = data.cursor.y; }
  });

 // --- SEÇÃO DE RODAPÉ (DUAS COLUNAS) ---
  
  // CONTROLE AQUI A DISTÂNCIA DO TOPO: 
  currentY += 90; 

  const alturaCaixas = 30; // Define uma altura padrão para as duas caixas
  
  // --- Coluna da Esquerda: Observações ---
  const obsX = margin;
  const obsWidth = 105; // Largura da coluna de observações
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Observações / Forma de Pagamento:", obsX, currentY);
  
  const obsY = currentY + 3;
  doc.setDrawColor(180, 180, 180); // Cor da borda da caixa
  doc.setLineWidth(0.2);
  doc.rect(obsX, obsY, obsWidth, alturaCaixas); // Desenha a caixa externa
  
  // --- Coluna da Direita: Totais ---
  const totalX = obsX + obsWidth + 5;
  const totalWidth = pageWidth - totalX - margin;
  
  const subtotal = orcamento.valor_total;
  const frete = 0;
  const total = subtotal + frete;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Textos e valores da seção de totais
  const xLabel = totalX + 5;
  const xValue = totalX + totalWidth - 5;
  const yStartTotal = obsY + 8;
  
  doc.text('SUBTOTAL', xLabel, yStartTotal);
  doc.text(formatCurrency(subtotal), xValue, yStartTotal, { align: 'right' });

  doc.text('FRETE', xLabel, yStartTotal + 10);
  doc.text(formatCurrency(frete), xValue, yStartTotal + 10, { align: 'right' });
  
  // Linha de separação para o total
  doc.setDrawColor(150, 150, 150);
  doc.line(totalX, yStartTotal + 15, totalX + totalWidth, yStartTotal + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL', xLabel, yStartTotal + 21);
  doc.text(formatCurrency(total), xValue, yStartTotal + 21, { align: 'right' });
  
  // --- RODAPÉ COM ASSINATURA E AUDITORIA ---
  const finalY = doc.internal.pageSize.getHeight(); 

  // Linha de Assinatura
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(60, finalY - 30, pageWidth - 60, finalY - 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("Assinatura do Cliente", pageWidth / 2, finalY - 25, { align: 'center' });

  // --- NOVA SEÇÃO DE AUDITORIA ---
  const agora = new Date();
  const dataHoraFormatada = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  
  const nomeUsuario = usuarioLogado?.nome || 'Usuário do Sistema';

  const textoAuditoria = `Criado em ${dataHoraFormatada} por ${nomeUsuario}`;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(textoAuditoria, margin, finalY - 10);

  // --- FIM DO RODAPÉ ---


  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};