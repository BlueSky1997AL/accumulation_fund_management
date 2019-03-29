import { InputNumber, Select } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export interface AmountMap {
    usernames: string[];
    amount: number;
}

interface AmountMapInputProps {
    value?: AmountMap;
    onChange?: (value: AmountMap) => void;
}

function AmountMapInput ({ value = {} as AmountMap, onChange }: AmountMapInputProps, ref: any) {
    const [ usernames, setUsernames ] = useState<string[]>([]);
    const [ amount, setAmount ] = useState<number | undefined>();

    useImperativeHandle(ref, () => ({}));

    function triggerChange (changedValue: any) {
        if (onChange) {
            onChange(Object.assign({}, { usernames, amount }, changedValue));
        }
    }

    return (
        <span>
            <Select
                mode="tags"
                open={false}
                value={'usernames' in value ? value.usernames : usernames}
                onChange={newUsernames => {
                    setUsernames(newUsernames);
                    triggerChange({ usernames: newUsernames });
                }}
                allowClear={true}
                tokenSeparators={[ ',', '，', ' ' ]}
                placeholder="输入用户名，多个用户名请使用逗号或空格分割"
                style={{
                    width: '75%',
                    marginRight: 16
                }}
            />
            <InputNumber
                value={'amount' in value ? value.amount : amount}
                style={{ marginRight: 16 }}
                placeholder="输入金额"
                onChange={newAmount => {
                    setAmount(newAmount);
                    triggerChange({ amount: newAmount });
                }}
            />
        </span>
    );
}

export default forwardRef(AmountMapInput);
