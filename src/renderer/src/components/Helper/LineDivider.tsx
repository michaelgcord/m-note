interface LineDividerProps {
    mode: string
}

const LineDivider = ({mode="horizontal"} : LineDividerProps): JSX.Element => {
    return (
        <div style={{
            height: (mode === 'horizontal') ? '1px' : '100%',
            width: (mode === 'horizontal') ? '100%' : '1px',
            backgroundColor: 'black',
            opacity: '25%'
        }}>
        </div>
    )
}

export default LineDivider