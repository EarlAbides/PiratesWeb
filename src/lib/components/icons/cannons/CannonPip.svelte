<script lang="ts">
	interface Props {
		type: 'S' | 'L';
		roll: 1 | 2 | 3 | 4 | 5 | 6;
	}

	const { type, roll }: Props = $props();

	type PipKey = 'TL' | 'TR' | 'ML' | 'MR' | 'C' | 'BL' | 'BR';

	const PP: Record<PipKey, { x: number; y: number }> = {
		TL: { x: 4.5,  y: 4.5  },
		TR: { x: 11.5, y: 4.5  },
		ML: { x: 4.5,  y: 8    },
		MR: { x: 11.5, y: 8    },
		C:  { x: 8,    y: 8    },
		BL: { x: 4.5,  y: 11.5 },
		BR: { x: 11.5, y: 11.5 },
	};

	const dotsByRoll: Record<1 | 2 | 3 | 4 | 5 | 6, PipKey[]> = {
		1: ['C'],
		2: ['TR', 'BL'],
		3: ['TR', 'C', 'BL'],
		4: ['TL', 'TR', 'BL', 'BR'],
		5: ['TL', 'TR', 'C', 'BL', 'BR'],
		6: ['TL', 'TR', 'ML', 'MR', 'BL', 'BR'],
	};

	const faceBg = $derived(type === 'S' ? '#ffffff' : '#cc2020');
	const dotFill = $derived(type === 'S' ? '#111111' : '#ffffff');
	const dots = $derived(dotsByRoll[roll]);
</script>

<svg aria-hidden="true" viewBox="0 0 16 16" style="width:100%;height:100%">
	<rect width="16" height="16" rx="2.5" fill="#000000" />
	<rect x="1.5" y="1.5" width="13" height="13" rx="1.5" fill={faceBg} />
	{#each dots as key}
		<circle cx={PP[key].x} cy={PP[key].y} r="1.4" fill={dotFill} />
	{/each}
</svg>
