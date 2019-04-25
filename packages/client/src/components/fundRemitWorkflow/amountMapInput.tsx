import { InputNumber, Select } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { moneyToHumanReadable } from '~utils/user';

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

    const [ baseAmount, setBaseAmount ] = useState<number | undefined>();
    const [ ratio, setRatio ] = useState<number | undefined>();

    useImperativeHandle(ref, () => ({}));

    function triggerChange (changedValue: any) {
        if (onChange) {
            onChange(Object.assign({}, { usernames, amount }, changedValue));
        }
    }

    useEffect(
        () => {
            if (baseAmount && ratio) {
                const newAmount = baseAmount * ratio / 100;
                if (newAmount > 3048) {
                    setAmount(3048);
                    triggerChange({ amount: 3048 });
                } else {
                    setAmount(newAmount);
                    triggerChange({ amount: newAmount });
                }
            }
        },
        [ baseAmount, ratio ]
    );

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
                placeholder="输入员工身份证号码"
                style={{
                    width: '35%',
                    marginRight: 16
                }}
            />
            <InputNumber
                style={{ marginRight: 8 }}
                placeholder="缴存基数"
                onChange={newBaseAmount => {
                    setBaseAmount(newBaseAmount);
                }}
            />
            <span>元</span>
            <InputNumber
                style={{ marginLeft: 16, marginRight: 8 }}
                placeholder="缴存比例"
                min={5}
                max={12}
                onChange={newRatio => {
                    if (newRatio && newRatio >= 5 && newRatio <= 12) {
                        setRatio(newRatio);
                    }
                }}
            />
            <span style={{ marginRight: 16 }}>%</span>
            <span>应缴额：</span>
            <span>{moneyToHumanReadable('amount' in value ? value.amount * 100 : amount && amount * 100)}</span>
            <span style={{ marginRight: 16 }}>元</span>
        </span>
    );
}

export default forwardRef(AmountMapInput);
