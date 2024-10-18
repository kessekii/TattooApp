import React, { FC, useRef, useEffect } from 'react';

export function setupForm(playCallback: (stream: string) => void): void {
    const params = new URLSearchParams(window.location.search);
    const streamParam = params.get('playbackUrl');

    const inputEl = document.querySelector('.src-input') as HTMLInputElement;

    if (streamParam) {
        inputEl.value = streamParam;
    }

    const formEl = document.querySelector('.src-container-direct') as HTMLFormElement;

    formEl.addEventListener('submit', (event) => {
        playCallback(inputEl.value);
    });
}

export function getFormStream(): string | undefined {
    const inputEl = document.querySelector('.src-input') as HTMLInputElement;
    return inputEl?.value;
}