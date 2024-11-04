<template>
    <svg width="60" height="20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="5" fill="#3498db">
            <animate attributeName="cy" values="10;5;10" dur="0.6s" begin="0s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="10" r="5" fill="#3498db">
            <animate attributeName="cy" values="10;5;10" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="10" r="5" fill="#3498db">
            <animate attributeName="cy" values="10;5;10" dur="0.6s" begin="0.4s" repeatCount="indefinite" />
        </circle>
    </svg>
</template>

<script>
export default {
    name: 'LoaderComponent',

};
</script>