const form = document.getElementById("formulario");
const grafico = document.getElementById("grafico");
let chart;
//trae los datos
const showData = async (moneda) => {
  try {
    const vData = await fetch(`https://mindicador.cl/api/${moneda}`);
    const resul = await vData.json();
    console.log(resul);
    return resul.serie;
  } catch (e) {
    alert(e.message);
  }
};
//showData("dolar")
//calcula las monedas
const totalMonedas = (valor, datos) => {
  const vMoneda = datos[0].valor;
  const t = valor / vMoneda;
  return Math.round(t * 100) / 100;
};
//pinta el total
const showTotal = (t) => {
  document.getElementById("t_valor").innerHTML = "Resultado: " + t;
};
//valores de moneda
const getValue = (datos) => {
  return datos.map((item) => item.valor);
};
//valores de fecha
const getDate = (datos) => {
  return datos.map((item) => new Date(item.fecha).toDateString("en-US"));
};
//destruir el grafico
const deadGrap = () => {
  if (chart) {
    chart.destroy();
  }
};

const cMonedas = async (valor, moneda) => {
  const datos = await showData(moneda);
  showGraf(datos, valor);
};

const showGraf = (datos, valor) => {
  const t = totalMonedas(valor, datos);
  showTotal(t);

  const label = getDate(datos).slice(1, 11);
  const labels = label;
  const values = getValue(datos);
  const moneda = form.elements["moneda"].value.toUpperCase();
  const datasets = [
    {
      label: `${moneda}`,
      borderColor: "rgb(25,0,19)",
      data: values,
    },
  ];
  const config = {
    type: "line",
    data: { labels, datasets },
  };
  deadGrap();
  grafico.style.backgroundColor="white";


  chart = new Chart(grafico, config);
};

form.addEventListener("submit", async (event) => {
  //evita que se actualize el form
  event.preventDefault();
  //INPUT
  const valor = form.elements["t_monto"].value;
  //SELECT
  const moneda = form.elements["moneda"].value;
  if (!valor) {
    alert("ingrese un Monto");
    return;
  }
  if (!moneda) {
    alert("ingrese una moneda");
    return;
  }
  await cMonedas(valor, moneda);
});
