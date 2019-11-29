import React from 'react';

interface props {
    map: any[]
    value: number | string
    valueField?: string
    descField?: string
}

class FieldMap extends React.PureComponent<props> {
    static defaultProps = {
        valueField: "v",
        descField: "n",
    }

    render() {
        let desc = this.props.children
        this.props.map.forEach(item => {
            if (String(this.props.value) === String(item[this.props.valueField || "v"])) {
                desc = <span>{String(item[this.props.descField || "n"])}</span>
            }
        })
        return desc
    }
}

export default FieldMap
