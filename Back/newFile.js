const webix = require('webix');

webix.ui({
  container: "webix-container",
  view: "list",
  autoheight: true,
  template: "Proposito: #proposito# ",
  data: [
    { id: 1, Proposito: "Verificar la gestión y el cumplimiento del programa institucional de capacitación y formación" },
    { id: 2, Proposito: "Realizar la verificación del cumplimiento de los lineamientos del estándar de Talento Humano establecido por la Resolución 3100 de 2019 aplicables a la institución de acuerdo con los servicios habilitados e inscriptos en el REPS." },
    { id: 3, Proposito: "Evaluar el proceso de selección y contratación institucional" },
    { id: 4, Proposito: "Verificar la gestión del proceso de inducción y reinducción" },
    { id: 5, Proposito: "Evaluar la gestión de las hojas de vida (planeación, organización, auto-ejecución, control y la evaluación)" },
  ]
});
