import {
    Select,
    SelectLabel,
    SelectGroup,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import Image from "next/image";

interface SelectComponentProps {
    onValueChange: (value: string) => void;
    placeholder: string;
    label: string;
    items: { title: string }[];
}

export const TransformSelect: React.FC<SelectComponentProps> = ({ onValueChange, placeholder, label, items }) => (
    <div style={{ flex: '1 1 50%', padding: '3px' }}>
        <Select onValueChange={(e) => onValueChange(e)}>
            <SelectTrigger style={{ borderColor: '#1a88c8', borderWidth: '1.5px', borderStyle: 'solid', display: 'flex' }}>
                <Image
                src="/assets/icons/lightning.svg" 
                alt='lightning'
                width={20}
                height={20}
                style={{ marginRight: '8px' }}/>
                <SelectValue placeholder={placeholder} style={{ flex: 1, textAlign: 'left' }}/>
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item, index) => (
                        <SelectItem key={index} value={item.title}>{item.title}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
);