// js/dashboard.js

const SUPABASE_URL = 'https://ldacffsmlyfyqczuljsh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYWNmZnNtbHlmeXFjenVsanNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5ODY0ODEsImV4cCI6MjA2NjU2MjQ4MX0.LWRkObfNkmjSquQstGp50v-lNa7kudrNve0mmbofSJs';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function cargarGrafico() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/v_ventas_por_mes?select=mes,total_mensual`, {
      method: 'GET',
      headers
    });

    if (!res.ok) throw new Error('No se pudieron obtener los datos');

    const data = await res.json();

    const meses = data.map(item =>
      new Date(item.mes).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
    );
    const totales = data.map(item => Number(item.total_mensual));

    const ctx = document.getElementById('graficoVentas').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Ventas Totales ($)',
          data: totales,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(29, 78, 216, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    Swal.fire('¡Datos cargados!', 'El gráfico de ventas se ha generado correctamente.', 'success');
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Error', error.message, 'error');
  }
}

window.onload = cargarGrafico;
