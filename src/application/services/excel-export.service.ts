import ExcelJS from 'exceljs';
import { Bet } from '../../domain/entities/Bet.entity';

export const generateExcel = (
  bets: Bet[],
  megaSigla: string,
  quinaSigla: string
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Apostas');

  if (bets.length === 0) {
    return workbook.xlsx.writeBuffer().then((buffer) => Buffer.from(buffer));
  }

  const lastRow = bets.length + 1;

  // Definir estilos reutilizáveis
  const defaultFont = { name: 'Calibri', size: 11, bold: true };
  const defaultAlignment = { horizontal: 'center' as const, vertical: 'middle' as const };
  const redFont = { ...defaultFont, color: { argb: 'FFFF0000' } };
  const defaultBorder = {
    top: { style: 'thin' as const },
    left: { style: 'thin' as const },
    bottom: { style: 'thin' as const },
    right: { style: 'thin' as const },
  };

  // Cabeçalho
  const headerRow = worksheet.getRow(1);
  headerRow.getCell(1).value = '#';
  headerRow.getCell(2).value = 'Nome';
  for (let i = 1; i <= 10; i++) {
    headerRow.getCell(i + 2).value = i.toString().padStart(2, '0');
  }
  headerRow.getCell(14).value = 'Pagamento';

  // Aplicar formatação no cabeçalho
  headerRow.font = defaultFont;
  headerRow.alignment = defaultAlignment;
  headerRow.eachCell((cell) => {
    cell.border = defaultBorder;
  });

  // Preencher dados e aplicar formatação em um único loop
  for (let i = 0; i < bets.length; i++) {
    const bet = bets[i];
    const rowNum = i + 2;
    const row = worksheet.getRow(rowNum);

    // Valores
    row.getCell(1).value = i + 1;
    const currentSigla = bet.gameType === 'Mega' ? megaSigla : quinaSigla;
    row.getCell(2).value = `${currentSigla} ${bet.playerName.toUpperCase()}`.trim();

    for (let j = 0; j < 10; j++) {
      row.getCell(j + 3).value = bet.selectedNumbers[j] || '';
    }

    const validationFormula = `IF(B${rowNum}="","",IF(OR(C${rowNum}<1,D${rowNum}<=C${rowNum},E${rowNum}<=D${rowNum},F${rowNum}<=E${rowNum},G${rowNum}<=F${rowNum},H${rowNum}<=G${rowNum},I${rowNum}<=H${rowNum},J${rowNum}<=I${rowNum},K${rowNum}<=J${rowNum},L${rowNum}<=K${rowNum},L${rowNum}>80),"Corrigir Números","Aposta Ok"))`;
    row.getCell(13).value = { formula: validationFormula };

    row.getCell(14).value = bet.isPaid ? 'PAGO' : '';

    // Formatação geral da linha (fonte, bordas, alinhamento)
    row.font = defaultFont;
    row.alignment = defaultAlignment;
    row.eachCell((cell) => {
      cell.border = defaultBorder;
    });

    // Formatações específicas
    row.getCell(1).font = redFont; // Coluna # em vermelho
    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' }; // Nome à esquerda

    if (bet.isPaid) {
      row.getCell(14).font = redFont; // Pagamento em vermelho se pago
    }
  }

  // Ajustar largura das colunas (otimizado)
  const columnWidths: number[] = [];
  for (let col = 1; col <= 14; col++) {
    let maxLength = 0;
    const column = worksheet.getColumn(col);
    
    // Verificar cabeçalho
    const headerCell = worksheet.getCell(1, col);
    const headerValue = headerCell.value?.toString() || '';
    if (headerValue.length > maxLength) {
      maxLength = headerValue.length;
    }

    // Verificar apenas algumas células amostra para performance (ou todas se necessário)
    // Para milhares de linhas, limitamos a amostragem
    const sampleSize = Math.min(bets.length, 100);
    const step = Math.max(1, Math.floor(bets.length / sampleSize));

    for (let i = 0; i < bets.length; i += step) {
      const cell = worksheet.getCell(i + 2, col);
      const cellValue = cell.value?.toString() || '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    }

    if (maxLength > 0) {
      columnWidths[col] = Math.min(maxLength + 2, 50);
      column.width = columnWidths[col];
    }
  }

  // Formatação condicional na coluna M (13) - Validação
  // Aplicada uma vez no range completo (eficiente)
  const validationRange = `M2:M${lastRow}`;
  worksheet.addConditionalFormatting({
    ref: validationRange,
    rules: [
      {
        type: 'cellIs',
        operator: 'equal',
        formulae: ['"Aposta Ok"'],
        priority: 1,
        style: {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF70AD47' }, // Verde (#70AD47)
          },
        },
      },
      {
        type: 'cellIs',
        operator: 'equal',
        formulae: ['"Corrigir Números"'],
        priority: 2,
        style: {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC7CE' }, // Vermelho claro (LightPink)
          },
        },
      },
    ],
  });

  return workbook.xlsx.writeBuffer().then((buffer) => Buffer.from(buffer));
};

