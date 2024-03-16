import React, { useEffect, useState } from 'react'
import '../App.css'

export default function Home() {
    const [Ms, setMs] = useState(13500)
    const [Ts, setTs] = useState(35000)
    const [price, setPrice] = useState(0)
    const [ess, setess] = useState(0)
    const [OpenNext, setOpenNext] = useState(false)
    const [output, setoutput] = useState(1)
    const [searchOut, setsearchOut] = useState("")
    const [prompt, setprompt] = useState("")
    document.title = "FAYP"
    const handleModel = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                mode: "cors",
                body: JSON.stringify({ data: [[Ts, Ms, price, ess]] })
            })
            const { res } = await response.json()
            setoutput(res)
            setOpenNext(true)
        }
        catch (err) {

        }
    }
    const handleSearch = async (e) => {
        e.preventDefault()
        document.getElementById("out").innerHTML ="<center>Processing...</center>"
        console.log(Ts, Ms, price, prompt);
        try {
            const response = await fetch("http://127.0.0.1:5000/ai", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                mode: "cors",
                body: JSON.stringify({ Ts, Ms, price, prompt })
            })
            const { res } = await response.json()
            setsearchOut(res)
            document.getElementById("out").innerHTML = `</br>Recommneded ${prompt}:</br>`
            document.getElementById("out").innerHTML += res
        }
        catch (err) {

        }
    }

    return (
        <div className="container">
            <div className="navigation">
                <ul>
                    <li>
                        <a href="#">
                            <span className="title" id="tit">FAYP</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="home-outline"></ion-icon>
                            </span>
                            <span className="title">Dashboard</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="people-outline"></ion-icon>
                            </span>
                            <span className="title">Finances</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="basket-outline"></ion-icon>
                            </span>
                            <span className="title">BUY</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="help-outline"></ion-icon>
                            </span>
                            <span className="title">Help</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="time-outline"></ion-icon>
                            </span>
                            <span className="title">History</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                            </span>
                            <span className="title">Password</span>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span className="icon">
                                <ion-icon name="log-out-outline"></ion-icon>
                            </span>
                            <span className="title">Sign Out</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="main">
                <div className="topbar">
                    <div className="toggle">
                        <ion-icon name="menu-outline"></ion-icon>
                    </div>

                    <div className="search">
                        <label>
                            <input type="text" placeholder="Search here" />
                            <ion-icon name="search-outline"></ion-icon>
                        </label>
                    </div>

                    <div className="user" style={{padding:"20px",backgroundColor:"black"}}>
                        
                    </div>
                </div>
                <div className="cardBox">
                    <div className="card">
                        <div>
                            <div className="numbers"> ₹ 23000</div>
                            <div className="cardName">Earning</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="cash-outline"></ion-icon>
                        </div>
                    </div>
                    <div className="card">
                        <div>
                            <div className="numbers">₹ {Ms}</div>
                            <div className="cardName">Monthly Savings</div>
                        </div>
                        <div className="iconBx">
                            <ion-icon name="wallet-outline"></ion-icon>
                        </div>
                    </div>

                    <div className="card">
                        <div>
                            <div className="numbers">₹ {Ts}</div>
                            <div className="cardName">Total Savings</div>
                        </div>
                    </div>

                </div>


                <div className="details" style={{display:"flex",justifyContent:"center"}}>
                    <div>

                        {
                            !OpenNext ?
                                <div className="recentOrders">
                                    <div className="cardHeader">
                                        <h2>BUY</h2>
                                    </div>
                                    <div className="wrapper">
                                        <form onSubmit={handleModel}>
                                            <p>Just add your details to investigate which type of payment <br />is best for you</p>
                                            <div className="intbx">
                                                <label >Enter Price of your Product</label>
                                                <input type="number" placeholder="Enter Product Price" onChange={e => setPrice(e.target.value)} value={price} />
                                            </div>
                                            <div className="intbx">
                                                <label >Change your Monhtly Savings</label>
                                                <input type="number" placeholder="Change monthly savings" onChange={e => setMs(e.target.value)} value={Ms} />
                                            </div>
                                            <div className="intbx">
                                                <label >Enter your Total Savings</label>
                                                <input type="number" placeholder="Change total savings" onChange={e => setTs(e.target.value)} value={Ts} />
                                            </div>
                                            <div className="imm">
                                                <input type="checkbox" style={{ marginRight: '10px' }} onClick={e => setess(ess == 0 ? 1 : 0)} value={ess} />
                                                <label>Need Immediately</label>
                                            </div>
                                            <button type="submit" className="btn">Evaluate</button>
                                        </form>
                                    </div>
                                </div> : <div>
                                    <h2 style={{marginBottom:20}}>Your requested Price: {price}</h2>
                                    {
                                        output == "0" ?
                                            <div>
                                                <p style={{ fontSize: 20 }}>We prefer you going with <span style={{ fontWeight: "bold" }}>Full down payment</span>
                                                </p>
                                                <p>becuase you have enough money to spend on your product.</p>

                                            </div> : output == "1" ? <div> <p style={{ fontSize: 20 }}>We prefer you going with <span style={{ fontWeight: "bold" }}>EMI + down payment</span>
                                            </p>
                                                By this way you can enjoy your product. But you have to spent monthly and you have to spend your whole savings
                                            </div> : output == "2" ? <div> <p style={{ fontSize: 20 }}>We prefer you going with <span style={{ fontWeight: "bold" }}>Full EMI</span>
                                            </p>
                                                By this way you can enjoy your product. But you have to spent monthly
                                            </div> : <div>something went wrong!</div>

                                    }
                                    <div style={{ marginTop: '20px' }}>Enter your product details to find  a good product.
                                        <div className="intbx" style={{ height: 10 }}>
                                            <input type="text" onChange={e => setprompt(e.target.value)} value={prompt} className="intbx" placeholder='Enter your product name' />
                                            <button className="btn" onClick={handleSearch}>Find my product</button>
                                            
                                            <div id='out' style={{ paddingBottom: 100,paddingTop:20 }}></div>
                                        </div>
                                    </div>
                                </div>

                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
