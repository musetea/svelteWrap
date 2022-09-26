<script>
    import TobBar from './TobBar.svelte';
    import Sheet from './Sheet.svelte';
    import BottomBar from './BottomBar.svelte';

</script>

<div class="container">
    <TobBar />
    <Sheet />
    <BottomBar />
</div>

<style>
    .container{
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 100px 1fr 50px;
    }
</style>