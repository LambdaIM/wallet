<template>
    <div class="card-container">
        <div class="card-wrapper">
            <Card dis-hover :title="cardtitle">
                <slot name="card-content"></slot>
                <div class="operation" slot="extra">
                    <slot name="operation"></slot>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        cardtitle: {
            type: String,
        },
    },
};
</script>

<style lang="less" scoped>
.card-container {
    width: 100%;
    margin-bottom: 20px;
    .card-wrapper {
        width: 96%;
        margin: 0 auto;
    }
}
</style>
