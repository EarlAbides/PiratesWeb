<script lang="ts">
	import type { Rarity } from '$lib/types/cardTypes';

	interface Props {
		cardNumber: string;
		rarity: Rarity;
	}

	const { cardNumber, rarity }: Props = $props();

	type RarityStyle = { bg: string; text: string };

	const STYLES: Record<Rarity, RarityStyle> = {
		Common:                { bg: '#991b1b', text: '#ffffff' },
		'Common Treasure':     { bg: '#d1d5db', text: '#1a1a1a' },
		Uncommon:              { bg: '#9ca3af', text: '#1a1a1a' },
		Rare:                  { bg: '#eab308', text: '#1a1a1a' },
		Treasure:              { bg: '#eab308', text: '#1a1a1a' },
		'Super Rare':          { bg: '#111111', text: '#ffffff' },
		'Super Rare Treasure': { bg: '#111111', text: '#ffffff' },
		'Limited Edition':     { bg: '#ea580c', text: '#ffffff' },
	};

	const s = $derived(STYLES[rarity] ?? { bg: '#9ca3af', text: '#1a1a1a' });
</script>

<!--
	Triangular corner badge — top-right corner of card row.
	clip-path fills the upper-right triangle; the hypotenuse is the single
	diagonal cut line visible to the viewer.
	Text: rotate(45deg) at top:12/right:5 keeps all four rotated corners
	      within the y < x triangle region (verified geometrically).
-->
<div
	class="pointer-events-none select-none absolute top-0 right-0"
	style="
		width: 64px;
		height: 64px;
		z-index: 10;
		clip-path: polygon(100% 0%, 100% 100%, 0% 0%);
		background-color: {s.bg};
	"
	aria-hidden="true"
>
	<span
		style="
			position: absolute;
			top: 12px;
			right: 5px;
			transform: rotate(45deg);
			transform-origin: 50% 50%;
			font-family: 'Cinzel', serif;
			font-weight: 700;
			font-size: 10px;
			color: {s.text};
			letter-spacing: 0.03em;
			white-space: nowrap;
		"
	>{cardNumber}</span>
</div>
