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
	<!-- 6 · MOVE RANGE DISPLAY                                 -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-4">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			6 · Move Range — Color Treatment Proposals
		</h2>
		<p class="text-xs text-neutral-500">
			Proposal: S = neutral (inherit row text color) · L = amber/gold (same as cannon color token).
		</p>

		<div class="flex flex-wrap items-start gap-8">
			<!-- S only -->
			<div class="flex flex-col items-center gap-2">
				<div class="flex items-center gap-1">
					<div class="w-8 h-8 shrink-0"><MoveIcon /></div>
					<span class="text-2xl font-bold text-neutral-100">S</span>
				</div>
				<span class="text-xs text-neutral-500">S only</span>
			</div>

			<!-- L only -->
			<div class="flex flex-col items-center gap-2">
				<div class="flex items-center gap-1">
					<div class="w-8 h-8 shrink-0"><MoveIcon /></div>
					<span class="text-2xl font-bold" style:color="var(--color-icon-gold)">L</span>
				</div>
				<span class="text-xs text-neutral-500">L only (gold)</span>
			</div>

			<!-- S+L split -->
			<div class="flex flex-col items-center gap-2">
				<div class="flex items-center gap-1">
					<div class="w-8 h-8 shrink-0"><MoveIcon /></div>
					<span class="text-2xl font-bold text-neutral-100">S</span>
					<span class="text-lg text-neutral-500">+</span>
					<span class="text-2xl font-bold" style:color="var(--color-icon-gold)">L</span>
				</div>
				<span class="text-xs text-neutral-500">S+L (color split)</span>
			</div>

			<!-- Numeric -->
			<div class="flex flex-col items-center gap-2">
				<div class="flex items-center gap-1">
					<div class="w-8 h-8 shrink-0"><MoveIcon /></div>
					<span class="text-2xl font-bold text-neutral-100">3</span>
				</div>
				<span class="text-xs text-neutral-500">Numeric (e.g. 3)</span>
			</div>

			<!-- S+L alternate: badge style -->
			<div class="flex flex-col items-center gap-2">
				<div class="flex items-center gap-1">
					<div class="w-8 h-8 shrink-0"><MoveIcon /></div>
					<span
						class="rounded px-1 text-sm font-bold text-neutral-100"
						style:background="rgba(0,0,0,0.4)">S</span
					>
					<span
						class="rounded px-1 text-sm font-bold"
						style:background="rgba(0,0,0,0.4)"
						style:color="var(--color-icon-gold)">L</span
					>
				</div>
				<span class="text-xs text-neutral-500">S+L (badge variant)</span>
			</div>
		</div>
	</section>

	<!-- ══════════════════════════════════════════════════════ -->
	<!-- 7 · ASSEMBLED STAT BAR                                 -->
	<!-- ══════════════════════════════════════════════════════ -->
	<section class="space-y-5">
		<h2 class="border-b border-neutral-700 pb-2 text-lg font-semibold text-neutral-300">
			7 · Assembled Stat Bar
		</h2>

		<div class="space-y-6">
			<div>
				<p class="mb-2 text-xs text-neutral-500">
					La Repulsa (1 mast · 2 cargo · S · 3S cannon) — current size on set bg:
				</p>
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<StatBar card={laRepulsa} />
				</div>
			</div>

			<div>
				<p class="mb-2 text-xs text-neutral-500">Same — 2× scale:</p>
				<div
					class="inline-flex rounded bg-set-spanish-main px-4 py-3"
					style:transform="scale(2)"
					style:transform-origin="left top"
					style:margin-bottom="3rem"
				>
					<StatBar card={laRepulsa} />
				</div>
			</div>

			<div class="mt-16">
				<p class="mb-2 text-xs text-neutral-500">
					HMS Dreadnought (5 masts · 4 cargo · S+L · 5 cannons) — current size:
				</p>
				<div class="inline-flex rounded bg-set-spanish-main px-4 py-3">
					<StatBar card={dreadnought} />
				</div>
			</div>

			<div>
				<p class="mb-2 text-xs text-neutral-500">Dreadnought — 2× scale:</p>
				<div
					class="inline-flex rounded bg-set-spanish-main px-4 py-3"
					style:transform="scale(2)"
					style:transform-origin="left top"
					style:margin-bottom="3rem"
				>
					<StatBar card={dreadnought} />
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
