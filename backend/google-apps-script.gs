/**
 * LUDI — recebe cadastros do carrinho (nome, telefone, itens) numa aba da
 * Planilha Google, para consulta manual de "carrinho em aberto", e também
 * registra cliques em "adicionar ao carrinho" pra alimentar o carrossel de
 * produtos mais populares da Home.
 *
 * Como instalar/atualizar: veja o passo a passo em LEIA-ME.md, seção
 * "Cadastro de clientes e carrinho em aberto".
 */

var CADASTROS_SHEET = "Cadastros";
var POPULARES_SHEET = "Populares";

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.type === "add_to_cart") {
    logAddToCart_(data);
  } else {
    logCadastro_(data);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET só serve pra alimentar o carrossel de destaques do site (contagem de
 * quantas vezes cada produto foi adicionado ao carrinho). Usa JSONP
 * (parâmetro ?callback=) porque um site estático não consegue ler resposta
 * de outro domínio sem isso.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(POPULARES_SHEET);
  var counts = {};

  if (sheet && sheet.getLastRow() > 1) {
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
    rows.forEach(function (row) {
      var sku = String(row[1] || "");
      if (!sku) return;
      if (!counts[sku]) counts[sku] = { count: 0, nome: row[2] || "", categoria: row[3] || "" };
      counts[sku].count++;
    });
  }

  var json = JSON.stringify(counts);
  var callback = e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function logCadastro_(data) {
  var sheet = getOrCreateSheet_(CADASTROS_SHEET, [
    "Data/Hora", "Nome", "Telefone", "Itens no carrinho", "Total", "Status", "Link WhatsApp"
  ]);
  sheet.appendRow([
    new Date(),
    data.nome || "",
    data.telefone || "",
    data.itens || "",
    data.total || "",
    data.status || "",
    data.linkWhatsApp || ""
  ]);
}

function logAddToCart_(data) {
  var sheet = getOrCreateSheet_(POPULARES_SHEET, ["Data/Hora", "SKU", "Nome", "Categoria"]);
  sheet.appendRow([new Date(), data.sku || "", data.nome || "", data.categoria || ""]);
}

function getOrCreateSheet_(name, headerRow) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headerRow);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
