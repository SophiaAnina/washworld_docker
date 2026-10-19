
export default function CardInput({ }) {
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="card-number">Kortnummer</label>
                <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    disabled
                />
            </div>
            <div style={{ display: "flex", justifyContent:'space-between' }}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <label htmlFor="expiry-date">Udløbsdato</label>
                    <input
                        id="expiry-date"
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        disabled
                    />
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                        id="cvv"
                        type="text"
                        inputMode="numeric"
                        size={3}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}