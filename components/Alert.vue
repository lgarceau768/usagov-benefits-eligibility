<template>
    <section class="usa-site-alert usa-site-alert--info margin-bottom-2" :aria-label="'Site alert, ' + heading + ' ' + ariaAlertText" role="alert">
        <div class="usa-alert">
            <div class="usa-alert__body">
                <h3 v-if="heading" class="usa-alert__heading">{{ heading }}</h3>
                <p class="usa-alert__text">
                    <slot></slot>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        heading: {
            type: String,
            required: false,
            default: '',
        },
        ariaAlertText: {
            type: String,
            required: false,
            default: '',
        },
    },
};
</script>
