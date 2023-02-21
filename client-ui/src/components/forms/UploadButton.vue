<template>
    <label for="file" class="upload-button-container" :style="`background: ${background}`">
        <img class="upload-button-img" :src="src" :alt="alt" />
        <p class="upload-button-pargraph">
            {{
                title
            }}
            <span
                class="upload-button-description"
            >{{ description }}</span>
        </p>
        <input
            @change="handleChange"
            style="display: none"
            type="file"
            name="file"
            id="file"
            class="inputFile"
            accept="image/png, image/jpg, image/jpeg"
            multiple
            ref="inputRef"
        />
    </label>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "box-little-component",
    props: {
        src: {
            type: String,
            default: "svg/icons/image-file-thummbnail.svg",
        },
        alt: { type: String, default: "image-icon" },
        title: { type: String, required: false },
        description: { type: String, required: false },
        background: { type: String, default: "#fff4dc" },
        uploadImage: { type: Function },
    },
    components: {},
    setup(props) {

        const handleChange = (e: any) => {
            props?.uploadImage?.(e)
        }
        return { handleChange };
    },
});
</script>

<style lang="scss" scoped>
.upload-button-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    gap: 1rem;
    padding: 0.5rem 0.7rem;
    border: 1px dashed $color-yellow;
    margin-bottom: 2px;
    justify-content: center;
    width: 204px;
    height: 78px;
}
.upload-button-img {
    transform: scale(1.1);
}
.upload-button-pargraph {
    margin-bottom: 0;
    font-size: 0.8rem;
    color: $east-bay;
    font-weight: 500;
}
.upload-button-description {
    display: block;
    font-size: 0.8rem;
    color: $waterloo-dark;
}
</style>
