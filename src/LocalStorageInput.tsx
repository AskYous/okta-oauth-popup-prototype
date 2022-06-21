import { useEffect, useState } from "react";

type Props = {
    /** Placeholder text */
    placeholder: string;
    /** Local storage key */
    lsKey: string;
    /** Event handler */
    onChange: (val: string) => any;
};

/** Creates an input that will save and load values from localstorage. */
export function LocalStorageInput({ placeholder, lsKey, onChange }: Props) {
    const [value, setValue] = useState<string>("");
    useEffect(() => {
        const val = localStorage.getItem(lsKey) || "";
        onChange(val);
        setValue(val)
    }, [lsKey, onChange]);

    return <div>
        <textarea
            cols={50}
            placeholder={placeholder}
            value={value}
            onChange={({ currentTarget }) => {
                const newVal = currentTarget.value
                setValue(newVal);
                onChange(newVal);
                localStorage.setItem(lsKey, newVal)
            }}
        />
    </div>;
}
