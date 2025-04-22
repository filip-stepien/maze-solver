import { Input } from './Input';

export class FileSelect extends Input {
    protected override inputType(): string {
        return 'file';
    }

    protected override eventType(): keyof HTMLElementEventMap {
        return 'change';
    }

    protected override htmlElement(): HTMLElement {
        const id = 'file-id';
        const input = document.createElement('input');
        const button = document.createElement('label');

        input.setAttribute('id', id);
        input.setAttribute('type', 'file');
        input.style.display = 'none';

        button.setAttribute('for', id);
        button.textContent = 'Upload';
        button.appendChild(input);

        return button;
    }

    protected override eventReturnValue(eventTarget: HTMLInputElement): Promise<string> {
        return new Promise((resolve, reject) => {
            const file = eventTarget.files[0];
            if (!file) reject();

            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
                eventTarget.value = '';
            };

            reader.readAsText(file);
        });
    }
}
