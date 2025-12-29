type DivOptions = {
  id: string;
  className: string;
  attributes: Record<string, string>;
  text: string;
};

export class ElementBuilder {
    static createDiv(parent: HTMLElement, options?: Partial<DivOptions>) {
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
}