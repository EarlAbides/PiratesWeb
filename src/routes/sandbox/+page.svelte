<script lang="ts">
	// DESIGN SANDBOX — Not linked from app. Visit /sandbox during `npm run dev`.
	// Use this page to iterate on individual card row components before implementing in production.

	import { base } from '$app/paths';
	import type { ShipCard } from '$lib/types/cardTypes';
	import PointBadge from '$lib/components/cards/PointBadge.svelte';
	import NationalityFlag from '$lib/components/cards/NationalityFlag.svelte';
	import StatBar from '$lib/components/cards/StatBar.svelte';
	import CardRow from '$lib/components/cards/CardRow.svelte';
	import CannonPip from '$lib/components/icons/cannons/CannonPip.svelte';
	import MoveDisplay from '$lib/components/cards/MoveDisplay.svelte';
	import CannonDisplay from '$lib/components/cards/CannonDisplay.svelte';
	import MastIcon from '$lib/components/icons/stat/MastIcon.svelte';
	import CargoIcon from '$lib/components/icons/stat/CargoIcon.svelte';
	import MoveIcon from '$lib/components/icons/stat/MoveIcon.svelte';
	import CannonIcon from '$lib/components/icons/stat/CannonIcon.svelte';

	// ── Reference cards ──────────────────────────────────────────────────────────

	const laRepulsa: ShipCard = {
		cardId: '5834',
		cardSet: 'PPSM',
		cardNumber: 'SS-004',
		name: 'La Repulsa',
		type: 'Ship',
		rarity: 'Rare',
		nationality: 'Spanish',
		pointValue: 14,
		imageFilename: 'PPSM_SS-004.jpg',
		ability: 'This ship gets +1 to her cannon rolls for every friendly ship within S of her.',
		description: '',
		modifiers: {},
		details: { masts: 1, cargo: 2, baseMove: 'S', cannons: ['3S'] }
	};

	// Multi-cannon, S+L move — for stress-testing the stat bar
	const dreadnought: ShipCard = {
		cardId: 'mock-dread',
		cardSet: 'PPSM',
		cardNumber: 'ES-001',
		name: 'HMS Dreadnought',
		type: 'Ship',
		rarity: 'Rare',
		nationality: 'English',
		pointValue: 26,
		imageFilename: 'PPSM_ES-001.jpg',
		ability: "This ship's cannons may not be eliminated (masts still may be). If derelict, she cannot shoot.",
		description: '',
		modifiers: {},
		details: { masts: 5, cargo: 4, baseMove: 'S+L', cannons: ['3S', '3S', '2S', '2L', '2L'] }
	};

	const nationalities = ['English', 'Spanish', 'French', 'American', 'Pirates'] as const;
	const rolls = [1, 2, 3, 4, 5, 6] as const;
	const iconSizes = [16, 32, 48, 96];

	// ── Cannon pip redesign data ─────────────────────────────────────────────

	type PipKey = 'TL' | 'TR' | 'ML' | 'MR' | 'C' | 'BL' | 'BR';

	// 7 canonical pip positions within a 16×16 viewBox (die face x=1.5–14.5, y=1.5–14.5)
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

	const fontOptions: { label: string; family: string; weight?: string; style?: string }[] = [
		{
			label: 'Copperplate (system)',
			family: "'Copperplate', 'Copperplate Gothic Light', fantasy"
		},
		{ label: 'Cormorant SC 700', family: "'Cormorant SC', serif", weight: '700' },
		{ label: 'Cormorant SC 900', family: "'Cormorant SC', serif", weight: '900' },
		{ label: 'Cinzel 700 (all-caps, no distinction)', family: "'Cinzel', serif", weight: '700' },
		{ label: 'Libre Baskerville 700', family: "'Libre Baskerville', serif", weight: '700' },
		{ label: 'IM Fell English', family: "'IM Fell English', serif" }
	];
</script>

<svelte:head>
	<title>Sandbox · Card Row Components</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+SC:wght@400;700;900&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-14 p-8">
	<!-- Header -->
	<div class="border-b border-neutral-600 pb-4">
		<h1 class="text-2xl font-bold text-neutral-100">Card Row · Component Sandbox</h1>
		<p class="mt-1 text-sm text-neutral-400">
			Design iteration workspace — not linked from the app. Reference ship: <strong
				class="text-neutral-300">La Repulsa</strong
			>
			· 14 pts · Spanish · 1 mast · 2 cargo · S move · 3S cannon
		</p>
	</div>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 1 · POINTS BADGE                                       -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-6">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			1 · Points Badge
		</h2>
		<p class="text-xs text-neutral-500">
			Cinzel Decorative 700 · 56×56 · dark gray bg · POINTS subtext · 2px black border. Shown on
			tan card row background.
		</p>

		<!-- A — Current (baseline) -->
		<div class="space-y-2">
			<p class="text-xs text-neutral-400">A — Current (baseline)</p>
			<div class="flex flex-wrap items-end gap-6">
				{#each [3, 5, 14, 22, 26] as pts}
					<div class="flex flex-col items-center gap-1">
						<PointBadge points={pts} />
						<span class="text-xs text-neutral-500">{pts} pts</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- B — 56×56 · dark gray · POINTS · 2px black border · on set bg -->
		<div class="space-y-2">
			<p class="text-xs text-neutral-400">
				B — 56×56 · Cinzel Decorative 700 · dark gray · POINTS · 2px black border
			</p>
			<div class="flex flex-wrap items-end gap-6">
				{#each [3, 5, 14, 22, 26] as pts}
					<div class="flex flex-col items-center gap-1">
						<div class="flex items-center bg-set-spanish-main p-2">
							<div
								class="flex h-14 w-14 shrink-0 flex-col items-center justify-center border-2 border-black"
								style:background-color="oklch(30% 0.01 0)"
								style:font-family="'Cinzel', serif"
								style:font-weight="700"
							>
								<span class="text-3xl leading-none text-neutral-100">{pts}</span>
								<span class="mt-0.5 text-[8px] tracking-widest text-neutral-200">POINTS</span>
							</div>
						</div>
						<span class="text-xs text-neutral-500">{pts} pts</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- C — B scaled 4× for close inspection -->
		<div class="space-y-2">
			<p class="text-xs text-neutral-400">C — B scaled 4× (refinement view)</p>
			<div class="flex flex-wrap gap-8">
				{#each [3, 14, 26] as pts}
					<div class="flex flex-col items-center gap-1">
						<!-- Container sized to the visual footprint of the scaled badge -->
						<div style:width="224px" style:height="224px" class="relative">
							<div
								class="absolute left-0 top-0 flex items-center bg-set-spanish-main p-2"
								style:transform="scale(4)"
								style:transform-origin="top left"
							>
								<div
									class="flex h-14 w-14 shrink-0 flex-col items-center justify-center border-2 border-black"
									style:background-color="oklch(30% 0.01 0)"
									style:font-family="'Cinzel', serif"
									style:font-weight="700"
								>
									<span class="text-2xl leading-none text-neutral-100">{pts}</span>
									<span class="mt-0.5 text-[8px] tracking-widest text-neutral-400">POINTS</span>
								</div>
							</div>
						</div>
						<span class="text-xs text-neutral-500">{pts} pts</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 2 · NATIONALITY FLAG                                   -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-4">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			2 · Nationality Flag
		</h2>

		<div class="space-y-6">
			<!-- Baseline -->
			<div>
				<p class="mb-2 text-xs text-neutral-500">
					Current — 24×16, <code>rounded-sm</code> (baseline):
				</p>
				<div class="flex flex-wrap items-end gap-5">
					{#each nationalities as nat}
						<div class="flex flex-col items-center gap-1">
							<NationalityFlag nationality={nat} />
							<span class="text-xs text-neutral-500">{nat}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Candidate: 36×24, no rounded, 1px border, on each set bg -->
			<div>
				<p class="mb-3 text-xs text-neutral-400">
					Candidate — 36×24 · no rounded corners · 1px border · on card backgrounds:
				</p>
				<div class="space-y-3">
					{#each [
						{ label: 'Spanish Main', bg: 'bg-set-spanish-main' },
						{ label: 'Crimson Coast', bg: 'bg-set-crimson-coast' },
						{ label: 'Revolution', bg: 'bg-set-revolution' }
					] as setRow}
						<div class="flex items-center gap-1 rounded px-3 py-2 {setRow.bg}">
							<span class="mr-3 w-28 shrink-0 text-xs opacity-60">{setRow.label}</span>
							{#each nationalities as nat}
								<div class="flex flex-col items-center gap-1 px-2">
									<img
										src="{base}/images/flags/{nat.toLowerCase()}.svg"
										alt={nat}
										width="36"
										height="24"
										class="shrink-0 border border-black/40"
									/>
									<span class="text-xs opacity-50">{nat.slice(0, 3)}</span>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- 48×32 kept for size comparison -->
			<div>
				<p class="mb-2 text-xs text-neutral-500">Size comparison — 48×32 (no border):</p>
				<div class="flex flex-wrap items-end gap-5">
					{#each nationalities as nat}
						<div class="flex flex-col items-center gap-1">
							<img
								src="{base}/images/flags/{nat.toLowerCase()}.svg"
								alt={nat}
								width="48"
								height="32"
								class="shrink-0"
							/>
							<span class="text-xs text-neutral-500">{nat}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 3 · SHIP NAME TYPOGRAPHY                               -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-4">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			3 · Ship Name Typography
		</h2>
		<p class="text-xs text-neutral-500">
			Target: preserve case, render with <strong class="text-neutral-400">small-caps</strong> so
			lowercase letters appear as smaller capitals (Copperplate-style). All options shown with
			<code>font-variant: small-caps</code> on set-colored background.
		</p>
		<div class="space-y-2">
			{#each fontOptions as font}
				<div class="flex items-center gap-4 rounded bg-set-spanish-main px-4 py-2">
					<span class="w-52 shrink-0 text-xs text-neutral-600">{font.label}</span>
					<span
						class="text-xl tracking-wide"
						style:font-family={font.family}
						style:font-weight={font.weight ?? '700'}
						style:font-style={font.style ?? 'normal'}
						style:font-variant="small-caps"
					>
						La Repulsa
					</span>
					<span
						class="text-base tracking-wide opacity-60"
						style:font-family={font.family}
						style:font-weight={font.weight ?? '700'}
						style:font-style={font.style ?? 'normal'}
						style:font-variant="small-caps"
					>
						HMS Dreadnought
					</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 4 · STAT ICONS (ISOLATED, MULTI-SIZE)                  -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-5">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			4 · Stat Icons — Current SVGs at Scale
		</h2>
		<p class="text-xs text-neutral-500">
			Shown at 16px (current row size), 32px, 48px, 96px. These need redesign to match reference card
			icons — ship silhouettes are wrong shape, mast/cargo distinction unclear.
		</p>

		{#each [
			{ label: 'MastIcon', key: 'mast' },
			{ label: 'CargoIcon', key: 'cargo' },
			{ label: 'MoveIcon', key: 'move' },
			{ label: 'CannonIcon', key: 'cannon' }
		] as row}
			<div class="flex items-end gap-6">
				<span class="w-24 shrink-0 text-xs text-neutral-400">{row.label}</span>
				{#each iconSizes as size}
					<div class="flex flex-col items-center gap-1">
						<div style:width="{size}px" style:height="{size}px">
							{#if row.key === 'mast'}
								<MastIcon />
							{:else if row.key === 'cargo'}
								<CargoIcon />
							{:else if row.key === 'move'}
								<MoveIcon />
							{:else}
								<CannonIcon />
							{/if}
						</div>
						<span class="text-xs text-neutral-600">{size}px</span>
					</div>
				{/each}
			</div>
		{/each}
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 4B · STAT ICONS — REDESIGN CANDIDATES                  -->
	<!-- ══════════════════════════════════════════════════════ -->

	<!--
		Ship layout (24×24 viewBox, left=bow, right=stern):
		  Hull:      y=18–22, x=2–22  (white)
		  Poop deck: y=15–18, x=17–22 (white, raised stern)
		  Bowsprit:  angled spar from bow toward top-left
		  Jib:       triangular headsail off bowsprit
		  Foremast:  sail bay x=3–8.5   (3 sails + flag)
		  Mainmast:  sail bay x=9.5–14.5 (4 sails + flag, tallest)
		  Mizzenmast: sail bay x=15.5–21 (3 sails + flag, starts higher on poop)
		  Spanker:   small triangle at stern
		Mast columns show as black background gaps at x≈8.5–9.5 and x≈14.5–15.5.
		Yard gaps show as black background gaps between each sail rect (~0.5 unit).

		MastIcon:  hull white, sails gold (both visible — sails are the feature)
		CargoIcon: hull white, sails ghosted (hull is the feature)
		MoveIcon:  full ship dim white at 58% x-scale + gold arrow right
	-->

	{#snippet shipHull(sailFill: string)}
		<!-- Hull body -->
		<path d="M2,18 L22,18 L21,22 Q12,24 3,22 Z" fill="var(--color-icon-ship)" />
		<!-- Poop deck (raised stern) -->
		<rect x="17" y="15" width="5" height="3" fill="var(--color-icon-ship)" />
		<!-- Bowsprit (angled spar, bow-left) -->
		<polygon points="3,18 4,17 1.5,13.5 0.5,14.5" fill="var(--color-icon-ship)" />

		<!-- ── Jib (triangular headsail off bowsprit) ── -->
		<polygon points="1,14 3.5,17.5 5.5,8" fill={sailFill} />

		<!-- ── Foremast bay (x=3–8.5) ── -->
		<!-- Course -->
		<rect x="3" y="13.5" width="5.5" height="3.5" fill={sailFill} />
		<!-- Topsail -->
		<rect x="3.5" y="10" width="5" height="3" fill={sailFill} />
		<!-- Topgallant -->
		<rect x="4" y="6.5" width="4.5" height="3" fill={sailFill} />
		<!-- Pennant -->
		<polygon points="5,4.5 5,6.5 7.5,5.5" fill={sailFill} />

		<!-- ── Mainmast bay (x=9.5–14.5) ── -->
		<!-- Course -->
		<rect x="9.5" y="13.5" width="5" height="3.5" fill={sailFill} />
		<!-- Topsail -->
		<rect x="10" y="10" width="4.5" height="3" fill={sailFill} />
		<!-- Topgallant -->
		<rect x="10.5" y="7" width="4" height="2.5" fill={sailFill} />
		<!-- Royal -->
		<rect x="11" y="4.5" width="3.5" height="2" fill={sailFill} />
		<!-- Pennant -->
		<polygon points="11.5,2.5 11.5,4.5 13.5,3.5" fill={sailFill} />

		<!-- ── Mizzenmast bay (x=15.5–21, raised ~2u for poop deck) ── -->
		<!-- Course -->
		<rect x="15.5" y="11.5" width="5.5" height="3" fill={sailFill} />
		<!-- Topsail -->
		<rect x="16" y="8.5" width="5" height="2.5" fill={sailFill} />
		<!-- Topgallant -->
		<rect x="16.5" y="6" width="4" height="2" fill={sailFill} />
		<!-- Pennant -->
		<polygon points="17,4 17,6 19.5,5" fill={sailFill} />

		<!-- ── Spanker (gaff sail at stern) ── -->
		<polygon points="19.5,11.5 22,14.5 22,17" fill={sailFill} />
	{/snippet}

	{#snippet newMastSvg()}
		<svg viewBox="0 0 24 24" style="width:100%;height:100%">
			<rect width="24" height="24" fill="var(--color-icon-bg)" />
			{@render shipHull('var(--color-icon-gold)')}
		</svg>
	{/snippet}

	{#snippet newCargoSvg()}
		<svg viewBox="0 0 24 24" style="width:100%;height:100%">
			<rect width="24" height="24" fill="var(--color-icon-bg)" />
			{@render shipHull('rgba(255,255,255,0.15)')}
		</svg>
	{/snippet}

	{#snippet newMoveSvg()}
		<!--
			viewBox wider than 24×24: ship occupies x=0–22 (identical to Mast/Cargo),
			3-unit gap, then gold arrow x=25–34. Total width=34, height=24.
			At ~22px tall render this gives ≈31px wide — close to 32×22 target.
		-->
		<svg viewBox="0 0 34 24" style="width:100%;height:100%">
			<rect width="34" height="24" fill="var(--color-icon-bg)" />
			<!-- Full-size ship, slightly dimmed so arrow pops -->
			<g opacity="0.65">
				{@render shipHull('var(--color-icon-ship)')}
			</g>
			<!-- Gold arrow (shaft + head) -->
			<rect x="25" y="10.5" width="5" height="2" fill="var(--color-icon-gold)" />
			<polygon points="30,8.5 34,11.5 30,14.5" fill="var(--color-icon-gold)" />
		</svg>
	{/snippet}

	{#snippet newCannonSvg()}
		<svg viewBox="0 0 24 24" style="width:100%;height:100%">
			<rect width="24" height="24" fill="var(--color-icon-bg)" />
			<!-- Barrel (tapered, pointing left) -->
			<polygon points="2,10 2,13 13,14 13,9" fill="var(--color-icon-gold)" />
			<!-- Carriage body -->
			<rect x="10" y="9" width="9" height="5" fill="var(--color-icon-gold)" />
			<!-- Wheels -->
			<circle cx="12.5" cy="17.5" r="2.5" fill="var(--color-icon-gold)" />
			<circle cx="18.5" cy="17.5" r="2.5" fill="var(--color-icon-gold)" />
		</svg>
	{/snippet}

	<section class="space-y-5">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			4B · Stat Icons — Redesign Candidates
		</h2>
		<p class="text-xs text-neutral-500">
			Full-rigged ship: jib · foremast (3 sails) · mainmast (4 sails) · mizzenmast (3 sails) ·
			spanker · bowsprit · poop deck. Hull is always white.
			<strong class="text-neutral-400">Mast</strong> = sails gold (both hull + sails visible).
			<strong class="text-neutral-400">Cargo</strong> = hull white, sails ghosted.
			<strong class="text-neutral-400">Move</strong> = dim ship compressed left + gold arrow.
		</p>

		{#each [
			{ label: 'MastIcon', key: 'mast' },
			{ label: 'CargoIcon', key: 'cargo' },
			{ label: 'MoveIcon (wider)', key: 'move' },
			{ label: 'CannonIcon', key: 'cannon' }
		] as row}
			<div class="flex items-end gap-6">
				<span class="w-24 shrink-0 text-xs text-neutral-400">{row.label}</span>
				{#each [16, 32, 48, 96] as size}
					<div class="flex flex-col items-center gap-1">
						<!-- Move icon uses 34×24 viewBox → proportionally wider container -->
						<div
							style="width:{row.key === 'move'
								? Math.round(size * 34 / 24)
								: size}px; height:{size}px;"
						>
							{#if row.key === 'mast'}
								{@render newMastSvg()}
							{:else if row.key === 'cargo'}
								{@render newCargoSvg()}
							{:else if row.key === 'move'}
								{@render newMoveSvg()}
							{:else}
								{@render newCannonSvg()}
							{/if}
						</div>
						<span class="text-xs text-neutral-600">{size}px</span>
					</div>
				{/each}
			</div>
		{/each}

		<!-- 48px tall: current → candidate side-by-side -->
		<div class="mt-4 space-y-2">
			<p class="text-xs text-neutral-500">48px tall — current → new candidate:</p>
			<div class="flex gap-10">
				{#each [
					{ label: 'Mast', key: 'mast' },
					{ label: 'Cargo', key: 'cargo' },
					{ label: 'Move', key: 'move' },
					{ label: 'Cannon', key: 'cannon' }
				] as col}
					<div class="flex flex-col items-center gap-2">
						<span class="text-xs text-neutral-400">{col.label}</span>
						<div class="flex items-center gap-3">
							<div class="h-12 w-12">
								{#if col.key === 'mast'}
									<MastIcon />
								{:else if col.key === 'cargo'}
									<CargoIcon />
								{:else if col.key === 'move'}
									<MoveIcon />
								{:else}
									<CannonIcon />
								{/if}
							</div>
							<span class="text-xs text-neutral-600">→</span>
							<!-- Move new: 68×48px (34/24 × 48) -->
							<div
								style="height:48px; width:{col.key === 'move'
									? Math.round(48 * 34 / 24)
									: 48}px;"
							>
								{#if col.key === 'mast'}
									{@render newMastSvg()}
								{:else if col.key === 'cargo'}
									{@render newCargoSvg()}
								{:else if col.key === 'move'}
									{@render newMoveSvg()}
								{:else}
									{@render newCannonSvg()}
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 4C · STAT ICONS — PROCESSED PNGs                       -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-5">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			4C · Stat Icons — Processed PNGs
		</h2>
		<p class="text-xs text-neutral-500">
			Source photos → 3-color remap (#000 / #fff / #c8960c) → LANCZOS scale. Output at 2× retina
			(44px tall). Shown at 22px (1×), 44px (2×), and 88px (4× for inspection).
		</p>

		{#each [
			{ label: 'masts', file: 'masts.png', w: 63, h: 44 },
			{ label: 'cargo', file: 'cargo.png', w: 63, h: 44 },
			{ label: 'move',  file: 'move.png',  w: 124, h: 44 },
			{ label: 'cannon',file: 'cannon.png',w: 82, h: 44 }
		] as icon}
			<div class="flex items-end gap-8">
				<span class="w-16 shrink-0 text-xs text-neutral-400">{icon.label}</span>
				<!-- 1× (22px tall) -->
				<div class="flex flex-col items-center gap-1">
					<img
						src="{base}/images/icons/{icon.file}"
						alt={icon.label}
						height="22"
						width={Math.round(22 * icon.w / icon.h)}
					/>
					<span class="text-xs text-neutral-600">22px</span>
				</div>
				<!-- 2× (44px tall, native) -->
				<div class="flex flex-col items-center gap-1">
					<img
						src="{base}/images/icons/{icon.file}"
						alt={icon.label}
						height={icon.h}
						width={icon.w}
					/>
					<span class="text-xs text-neutral-600">{icon.h}px (native)</span>
				</div>
				<!-- 4× (88px tall, inspection) -->
				<div class="flex flex-col items-center gap-1">
					<img
						src="{base}/images/icons/{icon.file}"
						alt={icon.label}
						height={icon.h * 2}
						width={icon.w * 2}
					/>
					<span class="text-xs text-neutral-600">{icon.h * 2}px (inspect)</span>
				</div>
				<!-- on set background at 1× -->
				<div class="flex flex-col items-center gap-1">
					<div class="flex items-center rounded bg-set-spanish-main px-3 py-2">
						<img
							src="{base}/images/icons/{icon.file}"
							alt={icon.label}
							height="22"
							width={Math.round(22 * icon.w / icon.h)}
						/>
					</div>
					<span class="text-xs text-neutral-600">on card bg</span>
				</div>
			</div>
		{/each}
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 5 · CANNON PIPS — ALL VARIANTS                         -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-5">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			5 · Cannon Pips — All Variants (48px)
		</h2>
		<p class="text-xs text-neutral-500">
			Current: S = white rounded square with die dots · L = red diamond with die dots. Reference card
			shows: <strong class="text-neutral-400">cannon icon + die face</strong> showing the roll number.
		</p>

		<div class="space-y-4">
			<div>
				<p class="mb-3 text-xs text-neutral-400">Short range (S) · rolls 1–6:</p>
				<div class="flex flex-wrap items-end gap-4">
					{#each rolls as roll}
						<div class="flex flex-col items-center gap-1">
							<div class="w-12 h-12">
								<CannonPip type="S" {roll} />
							</div>
							<span class="text-xs text-neutral-500">{roll}S</span>
						</div>
					{/each}
				</div>
			</div>

			<div>
				<p class="mb-3 text-xs text-neutral-400">Long range (L) · rolls 1–6:</p>
				<div class="flex flex-wrap items-end gap-4">
					{#each rolls as roll}
						<div class="flex flex-col items-center gap-1">
							<div class="w-12 h-12">
								<CannonPip type="L" {roll} />
							</div>
							<span class="text-xs text-neutral-500">{roll}L</span>
						</div>
					{/each}
				</div>
			</div>

			<div>
				<p class="mb-2 text-xs text-neutral-400">
					In-row context (current 16px) — La Repulsa has 3S:
				</p>
				<div class="inline-flex items-center gap-0.5 rounded bg-neutral-800 px-2 py-1">
					<CannonDisplay cannons={['3S']} />
				</div>
				<span class="ml-3 text-xs text-neutral-500">← this is what renders in the actual row</span>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 5B · CANNON PIPS — REDESIGN CANDIDATES                 -->
	<!-- ══════════════════════════════════════════════════════ -->

	<!-- Candidate A: die face only (16×16) -->
	{#snippet pipFace(roll: 1 | 2 | 3 | 4 | 5 | 6, type: 'S' | 'L')}
		{@const faceBg = type === 'S' ? '#ffffff' : '#cc2020'}
		{@const dotFill = type === 'S' ? '#111111' : '#ffffff'}
		<svg viewBox="0 0 16 16" style="width:100%;height:100%" aria-hidden="true">
			<rect width="16" height="16" rx="2.5" fill="#000000" />
			<rect x="1.5" y="1.5" width="13" height="13" rx="1.5" fill={faceBg} />
			{#each dotsByRoll[roll] as key}
				<circle cx={PP[key].x} cy={PP[key].y} r="1.4" fill={dotFill} />
			{/each}
		</svg>
	{/snippet}

	<section class="space-y-8">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			5B · Cannon Pips — Design Direction
		</h2>
		<p class="text-xs text-neutral-500">
			Settled design: <strong class="text-neutral-400">S</strong> = white face · black dots ·
			<strong class="text-neutral-400">L</strong> = red face · white dots. One cannon PNG on left,
			N die faces to the right. All 22px tall on a black background.
		</p>

		<!-- ── Die faces at 22px and 44px inspection ── -->
		<div class="space-y-5">
			<p class="text-xs font-medium text-neutral-400">Die faces — 22px (target) and 44px (inspect)</p>

			{#each (['S', 'L'] as const) as pipType}
				<div class="space-y-3">
					<p class="text-xs text-neutral-500">{pipType === 'S' ? 'Short (S)' : 'Long (L)'} · all rolls:</p>
					<!-- 44px inspect -->
					<div class="flex flex-wrap items-end gap-3">
						{#each rolls as roll}
							<div class="flex flex-col items-center gap-1">
								<div style="height:44px;width:44px">{@render pipFace(roll, pipType)}</div>
								<span class="text-xs text-neutral-600">{roll}{pipType}</span>
							</div>
						{/each}
					</div>
					<!-- 22px target -->
					<div class="flex items-center gap-2">
						<span class="w-16 shrink-0 text-xs text-neutral-600">22px target:</span>
						<div class="flex items-center gap-0.5">
							{#each rolls as roll}
								<div style="height:22px;width:22px">{@render pipFace(roll, pipType)}</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- ── Assembled: cannon PNG + die faces ── -->
		<div class="space-y-5">
			<p class="text-xs font-medium text-neutral-400">
				Assembled — cannon PNG + die faces · 22px row · 44px inspect
			</p>

			<!-- La Repulsa: 1 mast, 3S -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 3S · 22px:</p>
				<div class="inline-flex items-center gap-1 rounded bg-black px-2 py-1">
					<img src="{base}/images/icons/cannon.png" alt="cannon" height="22" width="41" class="shrink-0" />
					<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 3S · 44px inspect:</p>
				<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
					<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
					<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
				</div>
			</div>

			<!-- Dreadnought: 5 cannons, mixed S+L -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">Dreadnought — 3S 3S 2S 2L 2L · 22px:</p>
				<div class="inline-flex items-center gap-1 rounded bg-black px-2 py-1">
					<img src="{base}/images/icons/cannon.png" alt="cannon" height="22" width="41" class="shrink-0" />
					<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
					<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
					<div style="height:22px;width:22px">{@render pipFace(2, 'S')}</div>
					<div style="height:22px;width:22px">{@render pipFace(2, 'L')}</div>
					<div style="height:22px;width:22px">{@render pipFace(2, 'L')}</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">Dreadnought — 3S 3S 2S 2L 2L · 44px inspect:</p>
				<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
					<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
					<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
					<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
					<div style="height:44px;width:44px">{@render pipFace(2, 'S')}</div>
					<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
					<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 6 · MOVE RANGE DISPLAY                                 -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-6">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			6 · Move Range — Pill Design
		</h2>
		<p class="text-xs text-neutral-500">
			move.png (124×44 native) at 22px tall · same black pill as cannon ·
			Cinzel 700 · S = white · L = red · + = white.
		</p>

		<!-- 22px (target) -->
		<div class="space-y-3">
			<p class="text-xs font-medium text-neutral-400">22px — target row size</p>
			<div class="flex flex-wrap items-end gap-6">
				<!-- S -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/move.png" alt="move" height="22" width="62" class="shrink-0" />
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="26px">S</span>
					</div>
					<span class="text-xs text-neutral-600">S only</span>
				</div>
				<!-- L -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/move.png" alt="move" height="22" width="62" class="shrink-0" />
						<span class="leading-none text-red-500" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="26px">L</span>
					</div>
					<span class="text-xs text-neutral-600">L only</span>
				</div>
				<!-- S+L -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-0.5 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/move.png" alt="move" height="22" width="62" class="shrink-0" />
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="26px">S</span>
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="26px">+</span>
						<span class="leading-none text-red-500" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="26px">L</span>
					</div>
					<span class="text-xs text-neutral-600">S+L</span>
				</div>
			</div>
		</div>

		<!-- 44px (inspect) -->
		<div class="space-y-3">
			<p class="text-xs font-medium text-neutral-400">44px — inspect</p>
			<div class="flex flex-wrap items-end gap-6">
				<!-- S -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="52px">S</span>
					</div>
					<span class="text-xs text-neutral-600">S only</span>
				</div>
				<!-- L -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span class="leading-none text-red-500" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="52px">L</span>
					</div>
					<span class="text-xs text-neutral-600">L only</span>
				</div>
				<!-- S+L -->
				<div class="flex flex-col items-center gap-1">
					<div class="inline-flex items-end gap-1 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="52px">S</span>
						<span class="leading-none text-white" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="52px">+</span>
						<span class="leading-none text-red-500" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-size="52px">L</span>
					</div>
					<span class="text-xs text-neutral-600">S+L</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 7 · ASSEMBLED STAT BAR                                 -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-8">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			7 · Assembled Stat Bar
		</h2>
		<p class="text-xs text-neutral-500">
			Move/cannon pills are settled (sections 5B/6). Open question: how do
			<strong class="text-neutral-400">mast</strong> and
			<strong class="text-neutral-400">cargo</strong> counts display? Three layout candidates.
		</p>

		<!-- ── Baseline ── -->
		<div class="space-y-2">
			<p class="text-xs font-medium text-neutral-400">Baseline — current StatBar (reference)</p>
			<div class="flex flex-col gap-2">
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<StatBar card={laRepulsa} />
				</div>
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<StatBar card={dreadnought} />
				</div>
			</div>
		</div>

		<!-- ── Candidate A — Inline mast/cargo (no pill), pills for move/cannon ── -->
		<div class="space-y-3">
			<p class="text-xs font-medium text-neutral-400">
				A — Mast &amp; cargo inline · Move &amp; cannon in pills
			</p>
			<p class="text-xs text-neutral-600">
				Capacity stats are quieter (no pill bg). Action stats pop with black pills.
			</p>

			<!-- 22px -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 22px:</p>
				<div class="inline-flex items-center gap-3 rounded bg-set-spanish-main px-4 py-3">
					<span class="inline-flex items-end gap-1">
						<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.masts}</span>
					</span>
					<span class="inline-flex items-end gap-1">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
					</span>
					<MoveDisplay move={laRepulsa.details.baseMove} />
					<CannonDisplay cannons={laRepulsa.details.cannons} />
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 22px:</p>
				<div class="inline-flex items-center gap-3 rounded bg-set-spanish-main px-4 py-3">
					<span class="inline-flex items-end gap-1">
						<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.masts}</span>
					</span>
					<span class="inline-flex items-end gap-1">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.cargo}</span>
					</span>
					<MoveDisplay move={dreadnought.details.baseMove} />
					<CannonDisplay cannons={dreadnought.details.cannons} />
				</div>
			</div>

			<!-- 44px inspect -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 44px inspect:</p>
				<div class="inline-flex items-center gap-6 rounded bg-set-spanish-main px-6 py-4">
					<span class="inline-flex items-end gap-2">
						<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.masts}</span>
					</span>
					<span class="inline-flex items-end gap-2">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
					</span>
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
					</div>
					<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 44px inspect:</p>
				<div class="inline-flex items-center gap-6 rounded bg-set-spanish-main px-6 py-4">
					<span class="inline-flex items-end gap-2">
						<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.masts}</span>
					</span>
					<span class="inline-flex items-end gap-2">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.cargo}</span>
					</span>
					<div class="inline-flex items-end gap-1 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">+</span>
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:#cc2020">L</span>
					</div>
					<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Candidate B — All four stats in their own black pills ── -->
		<div class="space-y-3">
			<p class="text-xs font-medium text-neutral-400">
				B — All four stats in black pills (symmetric language)
			</p>
			<p class="text-xs text-neutral-600">
				Consistent visual weight. Mast/cargo pills are narrow (icon + number).
			</p>

			<!-- 22px -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 22px:</p>
				<div class="inline-flex items-stretch gap-2 rounded bg-set-spanish-main px-4 py-3">
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.masts}</span>
					</div>
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
					</div>
					<MoveDisplay move={laRepulsa.details.baseMove} />
					<CannonDisplay cannons={laRepulsa.details.cannons} />
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 22px:</p>
				<div class="inline-flex items-stretch gap-2 rounded bg-set-spanish-main px-4 py-3">
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.masts}</span>
					</div>
					<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.cargo}</span>
					</div>
					<MoveDisplay move={dreadnought.details.baseMove} />
					<CannonDisplay cannons={dreadnought.details.cannons} />
				</div>
			</div>

			<!-- 44px inspect -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 44px inspect:</p>
				<div class="inline-flex items-stretch gap-3 rounded bg-set-spanish-main px-6 py-4">
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.masts}</span>
					</div>
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
					</div>
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
					</div>
					<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 44px inspect:</p>
				<div class="inline-flex items-stretch gap-3 rounded bg-set-spanish-main px-6 py-4">
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.masts}</span>
					</div>
					<div class="inline-flex items-end gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.cargo}</span>
					</div>
					<div class="inline-flex items-end gap-1 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0" />
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">+</span>
						<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:#cc2020">L</span>
					</div>
					<div class="inline-flex items-center gap-2 rounded bg-black px-3 py-2">
						<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'S')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
						<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Candidate C — Tight mini-pills · 2px gap ── -->
		<div class="space-y-3">
			<p class="text-xs font-medium text-neutral-400">
				C — Flat mini-pills · 2px gap · square corners
			</p>
			<p class="text-xs text-neutral-600">
				Approved direction. Each stat group is a flat black pill, 2px apart.
			</p>

			<!-- 22px -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 22px:</p>
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<div class="inline-flex items-stretch gap-0.5">
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.masts}</span>
						</div>
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
						</div>
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/move.png" alt="move" height="22" width="62" class="shrink-0 mb-0.5" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">S</span>
						</div>
						<div class="inline-flex items-center gap-1 bg-black px-2 py-1">
							<img src="{base}/images/icons/cannon.png" alt="cannon" height="22" width="41" class="shrink-0" />
							<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 22px:</p>
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<div class="inline-flex items-stretch gap-0.5">
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/masts.png" alt="masts" height="22" width="32" class="shrink-0 mb-0.5" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.masts}</span>
						</div>
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/cargo.png" alt="cargo" height="22" width="32" class="shrink-0 mb-0.5" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{dreadnought.details.cargo}</span>
						</div>
						<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
							<img src="{base}/images/icons/move.png" alt="move" height="22" width="62" class="shrink-0 mb-0.5" />
							<span class="inline-flex items-end">
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">S</span>
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">+</span>
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:#cc2020">L</span>
							</span>
						</div>
						<div class="inline-flex items-center gap-1 bg-black px-2 py-1">
							<img src="{base}/images/icons/cannon.png" alt="cannon" height="22" width="41" class="shrink-0" />
							<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
							<div style="height:22px;width:22px">{@render pipFace(3, 'S')}</div>
							<div style="height:22px;width:22px">{@render pipFace(2, 'S')}</div>
							<div style="height:22px;width:22px">{@render pipFace(2, 'L')}</div>
							<div style="height:22px;width:22px">{@render pipFace(2, 'L')}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 44px inspect -->
			<div class="space-y-2">
				<p class="text-xs text-neutral-500">La Repulsa — 44px inspect:</p>
				<div class="inline-flex rounded bg-set-spanish-main px-6 py-4">
					<div class="inline-flex items-stretch gap-0.5">
						<div class="inline-flex items-end gap-3 bg-black px-3 py-2">
							<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.masts}</span>
						</div>
						<div class="inline-flex items-end gap-3 bg-black px-3 py-2">
							<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{laRepulsa.details.cargo}</span>
						</div>
						<div class="inline-flex items-end gap-3 bg-black px-3 py-2">
							<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0 mb-1" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
						</div>
						<div class="inline-flex items-center gap-2 bg-black px-3 py-2">
							<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
							<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs text-neutral-500">HMS Dreadnought — 44px inspect:</p>
				<div class="inline-flex rounded bg-set-spanish-main px-6 py-4">
					<div class="inline-flex items-stretch gap-0.5">
						<div class="inline-flex items-end gap-3 bg-black px-3 py-2">
							<img src="{base}/images/icons/masts.png" alt="masts" height="44" width="63" class="shrink-0 mb-1" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.masts}</span>
						</div>
						<div class="inline-flex items-end gap-3 bg-black px-3 py-2">
							<img src="{base}/images/icons/cargo.png" alt="cargo" height="44" width="63" class="shrink-0 mb-1" />
							<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">{dreadnought.details.cargo}</span>
						</div>
						<div class="inline-flex items-end gap-2 bg-black px-3 py-2">
							<img src="{base}/images/icons/move.png" alt="move" height="44" width="124" class="shrink-0 mb-1" />
							<span class="inline-flex items-end">
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">S</span>
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:white">+</span>
								<span style="font-family:'Cinzel',serif;font-weight:700;font-size:52px;line-height:1;color:#cc2020">L</span>
							</span>
						</div>
						<div class="inline-flex items-center gap-2 bg-black px-3 py-2">
							<img src="{base}/images/icons/cannon.png" alt="cannon" height="44" width="82" class="shrink-0" />
							<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
							<div style="height:44px;width:44px">{@render pipFace(3, 'S')}</div>
							<div style="height:44px;width:44px">{@render pipFace(2, 'S')}</div>
							<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
							<div style="height:44px;width:44px">{@render pipFace(2, 'L')}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 8 · FULL CARD ROW — CURRENT STATE                      -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-4">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			8 · Full Card Row — Current State
		</h2>
		<p class="text-xs text-neutral-500">The assembled row as it currently renders in the app.</p>
		<div class="overflow-hidden rounded border border-neutral-700">
			<CardRow card={laRepulsa} />
			<CardRow card={dreadnought} />
		</div>
	</section>
</div>
