<script lang="ts">
	interface Props {
		value: string;
		onchange: (v: string) => void;
	}
	const { value, onchange }: Props = $props();

	let timer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onchange((e.target as HTMLInputElement).value);
		}, 150);
	}
</script>

<input
	type="search"
	class="input input-sm w-full"
	placeholder="Search name or ability…"
	{value}
	oninput={handleInput}
/>
