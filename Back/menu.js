import inquirer from 'inquirer';
import fs from 'fs';
import Usuario from './usuario.js';
import { AccionCorrectivaPreventiva } from './accionesCorrectivas.js';
import { ListaVerificacion } from './listaDeVerificacion.js';

let auditor = null;
let lista = null;

export async function iniciarMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: 'Seleccione una opción:',
      choices: [
        '1. Crear auditor',
        '2. Crear lista de verificación',
        '3. Agregar ítem a lista',
        '4. Ver resumen',
        '5. Generar acción correctiva',
        '6. Exportar informe',
        '7. Salir'
      ]
    }
  ]);

  switch (opcion) {
    case '1. Crear auditor': {
      const { nombre, rol } = await inquirer.prompt([
        { type: 'input', name: 'nombre', message: 'Nombre del auditor:' },
        { type: 'input', name: 'rol', message: 'Rol del auditor:' }
      ]);
      auditor = new Usuario(nombre, rol);
      console.log(`✅ Auditor creado: ${auditor.nombre} (${auditor.rol})`);
      break;
    }

    case '2. Crear lista de verificación': {
      if (!auditor) {
        console.log('⚠️ Primero debes crear un auditor.');
        break;
      }
      const { proceso } = await inquirer.prompt([
        { type: 'input', name: 'proceso', message: 'Nombre del proceso:' }
      ]);
      lista = new ListaVerificacion(proceso, auditor, new Date().toISOString());
      console.log('✅ Lista creada.');
      break;
    }

    case '3. Agregar ítem a lista': {
      if (!lista) {
        console.log('⚠️ Primero debes crear una lista.');
        break;
      }
      const { criterio } = await inquirer.prompt([
        { type: 'input', name: 'criterio', message: 'Criterio a evaluar:' }
      ]);
      lista.agregarItem(criterio);
      console.log('📝 Ítem agregado.');
      break;
    }

    case '4. Ver resumen': {
      if (!lista) {
        console.log('⚠️ No hay lista cargada.');
      } else {
        console.log('\nResumen de criterios:');
        console.log(lista.obtenerResumen());
      }
      break;
    }

    case '5. Generar acción correctiva': {
      if (!auditor) {
        console.log('⚠️ Debes tener un auditor creado.');
        break;
      }
      const { desc, fecha } = await inquirer.prompt([
        { type: 'input', name: 'desc', message: 'Descripción de la acción correctiva:' },
        { type: 'input', name: 'fecha', message: 'Fecha compromiso (YYYY-MM-DD):' }
      ]);
      const accion = new AccionCorrectivaPreventiva(desc, 'Correctiva', auditor, fecha);
      console.log(`🚨 Acción creada: ${accion.descripcion} - Estado: ${accion.estado}`);
      break;
    }

    case '6. Exportar informe': {
      if (!lista) {
        console.log('⚠️ No hay lista que exportar.');
        break;
      }
      fs.writeFileSync('informeAuditoria.json', lista.exportarJSON());
      console.log('📁 Informe exportado como informeAuditoria.json');
      break;
    }

    case '7. Salir': {
      console.log('👋 Cerrando aplicación...');
      process.exit(0);
    }
  }

  await iniciarMenu();
}