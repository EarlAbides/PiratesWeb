<script lang="ts">
	interface Props {
		label: string;
		onremove: () => void;
	}
	const { label, onremove }: Props = $props();
</script>

<span class="badge badge-sm badge-neutral gap-1">
	{label}
	<button class="hover:text-error" onclick={onremove} aria-label="Remove filter">✕</button>
</span>
