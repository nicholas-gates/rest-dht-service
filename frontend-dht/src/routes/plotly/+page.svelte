<script lang="ts">
  import Plot from 'svelte-plotly.js';

  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16]
    }
  ];
</script>

<Plot
  {data}
  layout={{
    margin: { t: 0 }
  }}
  fillParent='width'
  debounce={250}
/>