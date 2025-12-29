type CommonOptions = {
  id: string;
  className: string;
  attributes: Record<string, string>;
  text: string;
};

type DivOptions = Partial<CommonOptions>;

type ButtonOptions = Partial<CommonOptions & {
    disabled: boolean;
    onClick: (event: MouseEvent) => void;
}>;

export class ElementBuilder {
    static createDiv(parent: HTMLElement, options?: DivOptions) {
        const div = document.createElement("div");
        div.id = options?.id ?? "";
        div.className = options?.className ?? "";
        div.innerText = options?.text ?? "";
        if (options?.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                div.setAttribute(key, value);
            })
        }
        parent.appendChild(div);
        return div;
    }

    static createButton(parent: HTMLElement, options?: ButtonOptions) {
        const button = document.createElement("button");
        button.id = options?.id ?? "";
        button.className = options?.className ?? "";
        button.innerText = options?.text ?? "";
        button.onclick = options?.onClick ?? null;
        button.disabled = options?.disabled ?? false;
        if (options?.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                button.setAttribute(key, value);
            })
        }
        parent.appendChild(button);
        return button;
    }
}