<script lang="ts">
  interface Props {
    type: 'S' | 'L';
    roll: 1 | 2 | 3 | 4 | 5 | 6;
  }

  const { type, roll }: Props = $props();

  const dotColor = $derived(type === 'S' ? 'var(--color-pip-short-dot)' : 'var(--color-pip-long-dot)');

  // Dot positions per roll value
  type Point = { x: number; y: number };

  const shortDots: Record<number, Point[]> = {
    1: [{ x: 8, y: 8 }],
    2: [{ x: 11, y: 4 }, { x: 5, y: 12 }],
    3: [{ x: 11, y: 4 }, { x: 8, y: 8 }, { x: 5, y: 12 }],
    4: [{ x: 5, y: 4 }, { x: 11, y: 4 }, { x: 5, y: 12 }, { x: 11, y: 12 }],
    5: [{ x: 5, y: 4 }, { x: 11, y: 4 }, { x: 8, y: 8 }, { x: 5, y: 12 }, { x: 11, y: 12 }],
    6: [{ x: 5, y: 4 }, { x: 5, y: 8 }, { x: 5, y: 12 }, { x: 11, y: 4 }, { x: 11, y: 8 }, { x: 11, y: 12 }],
  };

  const longDots: Record<number, Point[]> = {
    1: [{ x: 8, y: 8 }],
    2: [{ x: 11, y: 5.5 }, { x: 5, y: 10.5 }],
    3: [{ x: 11, y: 5.5 }, { x: 8, y: 8 }, { x: 5, y: 10.5 }],
    4: [{ x: 6, y: 5.5 }, { x: 10, y: 5.5 }, { x: 6, y: 10.5 }, { x: 10, y: 10.5 }],
    5: [{ x: 6, y: 5.5 }, { x: 10, y: 5.5 }, { x: 8, y: 8 }, { x: 6, y: 10.5 }, { x: 10, y: 10.5 }],
    6: [{ x: 6, y: 5.5 }, { x: 6, y: 8 }, { x: 6, y: 10.5 }, { x: 10, y: 5.5 }, { x: 10, y: 8 }, { x: 10, y: 10.5 }],
  };

  const dots = $derived(type === 'S' ? shortDots[roll] : longDots[roll]);
</script>

<svg
  aria-hidden="true"
  viewBox="0 0 16 16"
  xmlns="http://www.w3.org/2000/svg"
>
  {#if type === 'S'}
    <!-- Short pip: white rounded square -->
    <rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill="var(--color-pip-short-bg)" stroke="#CCCCCC" stroke-width="0.5" />
  {:else}
    <!-- Long pip: red diamond -->
    <polygon points="8,1 15,8 8,15 1,8" fill="var(--color-pip-long-bg)" />
  {/if}

  <!-- Dots -->
  {#each dots as dot}
    <circle cx={dot.x} cy={dot.y} r="1.2" fill={dotColor} />
  {/each}
</svg>
