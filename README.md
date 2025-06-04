# Debe-Hacer Almacén: Sistema Avanzado de Gestión de Inventario

## Descripción General 📝

AlmacenControl es una aplicación web moderna y robusta, diseñada para ofrecer una solución completa y eficiente para la gestión de inventarios. Construida con las últimas tecnologías frontend, como Next.js y React, esta herramienta permite a los usuarios llevar un control exhaustivo de sus productos, desde su registro inicial hasta el seguimiento detallado de cada movimiento de stock. Su interfaz intuitiva y amigable, basada en componentes ShadCN UI y estilizada con Tailwind CSS, facilita la administración de inventarios, la generación de informes y la toma de decisiones informadas.

La aplicación está pensada para ser altamente funcional y adaptable, permitiendo a los usuarios:
*   **Añadir y catalogar productos** con información detallada. ➕
*   **Visualizar el inventario actual** de forma clara y organizada. 📊
*   **Registrar con precisión las entradas y salidas** de stock. ✍️
*   **Generar informes detallados** sobre el estado y movimiento del inventario. 📄
*   **Exportar datos relevantes** para análisis externos o copias de seguridad. 💾
*   **Persistencia de datos local** para una experiencia de usuario fluida y sin interrupciones. 💻

## Características Principales ✨

AlmacenControl ofrece un conjunto completo de herramientas para la gestión de inventario:

### 1. Gestión de Productos 📦

*   **Creación de Productos:** ➕
    *   Añade nuevos productos al sistema especificando:
        *   **Nombre:** Identificador principal del producto (ej. "Paté Suave La Piara").
        *   **Descripción (Opcional):** Detalles adicionales sobre el producto (ej. "Lata de 75g, pack de 3").
        *   **Precio de Compra:** Costo de adquisición del producto por unidad.
        *   **Precio de Venta:** Precio al que se vende el producto por unidad.
        *   **Cantidad Inicial:** Stock inicial del producto al momento de su registro.
    *   Validación de datos en el formulario para asegurar la integridad de la información.
*   **Visualización de Inventario:** 📊
    *   Una tabla principal muestra todos los productos registrados con información crucial:
        *   Nombre del producto.
        *   Descripción (resumida).
        *   Precio de compra unitario.
        *   Precio de venta unitario.
        *   Cantidad actual en stock.
        *   **Valor Total de Compra:** Calculado como (Precio de Compra * Cantidad).
        *   **Valor Total de Venta (Potencial):** Calculado como (Precio de Venta * Cantidad).
        *   Fecha y hora de la última actualización del producto.
    *   Si no hay productos, se muestra un mensaje amigable invitando al usuario a añadir el primero.
*   **Edición de Productos:** ✏️
    *   Modifica la información de los productos existentes (nombre, descripción, precio de compra, precio de venta).
    *   **Importante:** La cantidad de un producto existente no se edita directamente desde el formulario de producto; se actualiza automáticamente a través de los movimientos de stock.
*   **Eliminación de Productos:** 🗑️
    *   Elimina productos del inventario.
    *   Al eliminar un producto, también se eliminan todos sus movimientos de stock asociados para mantener la consistencia de los datos.
    *   Se muestra un diálogo de confirmación para prevenir eliminaciones accidentales.

### 2. Gestión de Movimientos de Stock ↔️

*   **Registro de Movimientos:** ✍️
    *   Permite registrar entradas (compras, ingresos, devoluciones de clientes) y salidas (ventas, mermas, devoluciones a proveedores) de stock para cada producto.
    *   El formulario de movimiento de stock requiere:
        *   **Producto:** Selección de un producto existente del inventario. Se muestra el stock actual del producto seleccionado para referencia.
        *   **Tipo de Movimiento:** Entrada (Debe) o Salida (Haber).
        *   **Cantidad:** Número de unidades que entran o salen.
        *   **Fecha:** Fecha en que ocurrió el movimiento (seleccionable mediante un calendario).
        *   **Notas (Opcional):** Información adicional relevante (ej. "Pedido Proveedor #123", "Venta Cliente X", "Ajuste por inventario físico").
    *   Validación para no permitir salidas de stock mayores a la cantidad disponible.
*   **Actualización Automática de Stock:** 🔄
    *   Al registrar un movimiento, la cantidad del producto afectado se actualiza automáticamente en el inventario general.
*   **Historial de Movimientos:** 📜
    *   Una tabla muestra los movimientos de stock recientes, ordenados por fecha (los más recientes primero).
    *   Cada entrada en la tabla incluye:
        *   Fecha y hora del movimiento.
        *   Nombre del producto.
        *   Tipo de movimiento (Entrada o Salida, con indicadores visuales).
        *   Cantidad.
        *   Notas.
    *   Si no hay productos en el inventario, se guía al usuario para que primero añada productos.

### 3. Informes y Exportación 📄

*   **Informe Detallado de Inventario:** 📈
    *   Genera un informe completo que resume el estado del inventario.
    *   La tabla de informes muestra para cada producto:
        *   Nombre del Producto.
        *   **Entradas Totales (Debe):** Suma de todas las cantidades de entrada registradas para el producto.
        *   **Salidas Totales (Haber):** Suma de todas las cantidades de salida registradas para el producto.
        *   **Stock Actual:** Cantidad actual del producto.
        *   Precio de Compra unitario.
        *   Precio de Venta unitario.
        *   **Valor Total de Compra:** Valor del stock actual a precio de compra.
        *   **Valor Total de Venta (Potencial):** Valor potencial del stock actual si se vendiera a precio de venta.
    *   Los productos en el informe se ordenan alfabéticamente por nombre.
*   **Exportación a CSV:** 💾
    *   Permite exportar los datos del informe detallado a un archivo CSV (`informe_almacen_control.csv`).
    *   Esta funcionalidad es útil para análisis externos, compartir datos o realizar copias de seguridad.
    *   Si no hay datos, el botón de exportación se deshabilita y se muestra un mensaje informativo.

### 4. Interfaz de Usuario y Experiencia 🎨

*   **Navegación Intuitiva:** 🧭
    *   Una barra lateral persistente (Sidebar) permite un acceso rápido a todas las secciones principales de la aplicación: Inventario, Añadir Producto, Movimientos de Stock e Informes.
    *   La barra lateral es colapsable en escritorio para maximizar el espacio de contenido y se convierte en un menú off-canvas en dispositivos móviles.
*   **Diseño Moderno y Responsivo:** 📱💻
    *   Utiliza ShadCN UI y Tailwind CSS para una apariencia limpia, profesional y adaptable a diferentes tamaños de pantalla (escritorio, tableta, móvil).
*   **Notificaciones (Toasts):** 🔔
    *   Proporciona retroalimentación al usuario mediante notificaciones emergentes (toasts) para acciones como añadir, actualizar o eliminar productos, y registrar movimientos de stock, indicando éxito o error.
*   **Formularios Amigables:** 😊
    *   Formularios claros con validación de datos en tiempo real y mensajes de error específicos para guiar al usuario.
*   **Persistencia de Datos Local:** 💾
    *   Utiliza Zustand con el middleware `persist` para guardar el estado de la aplicación (productos y movimientos de stock) en el `localStorage` del navegador. Esto asegura que los datos no se pierdan al cerrar la pestaña o el navegador, ofreciendo una experiencia continua.
*   **Manejo de Carga e Hidratación:** ⏳
    *   Muestra indicadores de carga mientras se hidratan los datos del store en el cliente para evitar destellos de contenido incorrecto.
*   **Internacionalización:** 🇪🇸
    *   Toda la interfaz de usuario, incluyendo etiquetas, mensajes y formatos de fecha y moneda, está en castellano (Español). Las cantidades monetarias se muestran en formato Euro (€), utilizando punto como separador de miles y coma para los decimales.

## Tecnologías Utilizadas 🛠️

AlmacenControl está construido con un stack de tecnologías moderno y eficiente:

*   **Next.js (v15+):** Framework de React para producción, utilizando el App Router para una mejor estructura y rendimiento.
*   **React (v18+):** Biblioteca de JavaScript para construir interfaces de usuario.
*   **TypeScript:** Superset de JavaScript que añade tipado estático para mejorar la calidad y mantenibilidad del código.
*   **ShadCN UI:** Colección de componentes de UI reutilizables, construidos sobre Radix UI y Tailwind CSS, personalizables y accesibles.
*   **Tailwind CSS:** Framework de CSS "utility-first" para un diseño rápido y personalizado.
*   **Zustand:** Solución de gestión de estado simple, rápida y escalable para React, con persistencia en localStorage.
*   **Lucide React:** Biblioteca de iconos SVG ligera y personalizable.
*   **React Hook Form & Zod:** Para la gestión y validación de formularios.
*   **Date-fns:** Para la manipulación y formateo de fechas.
*   **Genkit (Base):** Aunque no se han implementado funcionalidades de IA específicas en esta versión, la aplicación incluye la configuración base de Genkit, lo que sienta las bases para futuras integraciones de capacidades de inteligencia artificial (por ejemplo, predicción de stock, optimización de precios, etc.). 🤖

## Cómo Empezar (Desarrollo) 🚀

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd almacen-control
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación estará disponible en `http://localhost:9002` (o el puerto configurado).

## Futuras Mejoras (Potenciales) 💡

*   **Autenticación de Usuarios:** Implementar un sistema de inicio de sesión para proteger los datos y permitir múltiples usuarios. 🔐
*   **Roles y Permisos:** Definir diferentes niveles de acceso para los usuarios. 👤
*   **Integración con Genkit:** 🧠
    *   **Sugerencias Inteligentes:** Utilizar IA para sugerir puntos de reorden, optimizar descripciones de productos o predecir demandas.
    *   **Análisis Avanzado:** Generar insights a partir de los datos de inventario y movimientos.
*   **Importación Masiva de Productos:** Permitir la carga de productos desde un archivo CSV o Excel. ⬆️
*   **Sincronización con la Nube:** Ofrecer la opción de guardar los datos en una base de datos en la nube (ej. Firebase Firestore) en lugar de solo localmente. ☁️
*   **Alertas de Stock Bajo:** Notificaciones automáticas cuando el stock de un producto alcance un umbral mínimo. ⚠️
*   **Gráficos y Visualizaciones Avanzadas:** Integrar gráficos para un análisis visual más profundo de las tendencias de inventario. 📈

