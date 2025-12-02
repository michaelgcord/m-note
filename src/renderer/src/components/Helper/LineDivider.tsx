interface LineDividerProps {
    mode: string
    length?: string
}

const LineDivider = ({mode="horizontal", length='100%'} : LineDividerProps): JSX.Element => {
    return (
        <div style={{
            height: (mode === 'horizontal') ? '1px' : length,
            width: (mode === 'horizontal') ? length : '1px',
            backgroundColor: 'black',
            opacity: '25%',
            margin: '0 auto'
        }}>
        </div>
    )
}

export default LineDivider