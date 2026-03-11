<!-- src/components/blocks/Search.vue -->
<template>
    <form action="" method="GET" class="search">
        <label for="search" class="search__label">
            <svg class="search__icon" width="24" height="24">
                <use xlink:href="/images/sprite.svg#icon-search"></use>
            </svg>
            <input class="search__field" type="search" name="search" id="search" placeholder="Поиск фильмов">
        </label>
        <button type="button" class="btn search__btn" aria-label="Найти">
            <svg width="24" height="24" class="header__form-icon" aria-hidden="true">
                <use xlink:href="/images/sprite.svg#icon-search"></use>
            </svg>
        </button>
    </form>
</template>
<script setup>
</script>