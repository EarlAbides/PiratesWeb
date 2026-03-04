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
		Uncommon:              { bg: 'radial-gradient(ellipse at 65% 35%, #e5e7eb 0%, #9ca3af 45%, #4b5563 100%)', text: '#1a1a1a' },
		Rare:                  { bg: 'radial-gradient(ellipse at 65% 35%, #fde68a 0%, #eab308 45%, #92400e 100%)', text: '#1a1a1a' },
		Treasure:              { bg: 'radial-gradient(ellipse at 65% 35%, #fde68a 0%, #eab308 45%, #92400e 100%)', text: '#1a1a1a' },
		'Super Rare':          { bg: '#111111', text: '#ffffff' },
		'Super Rare Treasure': { bg: '#111111', text: '#ffffff' },
		'Limited Edition':     { bg: '#ea580c', text: '#ffffff' },
	};

	const s = $derived(STYLES[rarity] ?? { bg: '#9ca3af', text: '#1a1a1a' });

	// Dynamic font size: short card numbers (3-digit) get bigger text
	const badgeFontSize = $derived(
		cardNumber.length <= 3 ? '13px' : cardNumber.length <= 4 ? '12px' : '11px'
	);

	// Nudge position to keep text visually centered on the diagonal
	// Short numbers sit too far down-right → shift up-left (less top, more right)
	// Long numbers sit too far up-left → shift down-right (more top, less right)
	const badgeTop = $derived(
		cardNumber.length <= 3 ? '10px' : cardNumber.length <= 4 ? '12px' : '14px'
	);
	const badgeRight = $derived(
		cardNumber.length <= 3 ? '7px' : cardNumber.length <= 4 ? '5px' : '3px'
	);
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
		background: {s.bg};
	"
	aria-hidden="true"
>
	<span
		style="
			position: absolute;
			top: {badgeTop};
			right: {badgeRight};
			transform: rotate(45deg);
			transform-origin: 50% 50%;
			font-family: 'Cinzel', serif;
			font-weight: 700;
			font-size: {badgeFontSize};
			color: {s.text};
			letter-spacing: 0.03em;
			white-space: nowrap;
		"
	>{cardNumber}</span>
</div>
