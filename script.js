async function fetchBusData() {
    const apiUrl = `https://mna.mecatran.com/utw/ws/gtfsfeed/vehicles/valleymetro?apiKey=4f22263f69671d7f49726c3011333e527368211f&asJson=true&_=${new Date().getTime()}`;
    
    try{
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const vehicles = data?.entity || [];
        
        const busSummary = document.getElementById("bus-summary");
        const busList = document.getElementById("bus-list");
        busSummary.innerHTML = "";
        busList.innerHTML = "";

        if (vehicles.length === 0) {
            busList.innerHTML = "No active vehicles found.";
            return;
        }
        
        //DEF fleet numbers
        let busFleet ={
            count101to150: {count: 0, year: 2008, make: "Kinki Sharyo", model: "LF LRV"}, //KinkiSharyo LRV
            count180to185: {count: 0, year: 2021, make: "Bookville", model: "Liberty"}, //Brookville Liberty Streetcar
            count201to225: {count: 0, year: 2021, make: "Siemens", model: "S700"}, //Siemens S700 LRV
            count1605to1611: {count: 0, year: 2017, make: "ENC", model: "EZ Rider II", length: 32, fuel: "CNG"},
            count1612and1623to1627: {count: 0, year: 2018, make: "ENC", model: "EZ Rider II", length: 32, fuel: "CNG"}, //2018 ENC E-Z Rider II BRT 32' CNG
            count1617to1622: {count: 0, year: 2018, make: "ARBOC", model: "Spirit of Liberty"}, //2018 ARBOC Spirit of Liberty 29'
            count1628to1630: {count: 0, year: 2018, make: "Freightliner/Startrans", model: "P/S2C"}, //2018 Freightliner S2 (StarTrans P/S2C)
            count1631to1642: {count: 0, year: 2019, make: "ENC", model: "EZ Rider II", length: 32, fuel: "CNG"}, //2019 ENC E-Z Rider II BRT 32' CNG
            count1643: {count: 0, year: 2020, make: "ARBOC", model: "Freedom"}, //2020 ARBOC Freedom
            count1644to1649: {count: 0, year: 2020, make: "ARBOC", model: "Equess", fuel: "CNG"}, //2020 ARBOC Equess CNG
            count1650to1666: {count: 0, year: 2021, make: "Gillig", model: "Low Floor", length: 29, fuel: "CNG"}, //2021 Gillig Low Floor CNG 29'
            count1667to1672: {count: 0, year: 2022, make: "Gillig", model: "Low Floor", length: 29, fuel: "CNG"}, //2022 Gillig Low Floor CNG 29'
            count3003to3005: {count: 0, year: 2016, make: "Ford/Starcraft", model: "E-450/Allstar"}, //2016 Ford E-450 (Starcraft Allstar)
            count3006to3008: {count: 0, year: 2020, make: "Ford/Starcraft", model: "E-450/Allstar"}, //2020 Ford E-450 (Starcraft Allstar)
            count3009to3011: {count: 0, year: 2021, make: "Ford/Starcraft", model: "E-450/Allstar"}, //2021 Ford E-450 (Starcraft Allstar)
            count3012to3018: {count: 0, year: 2022, make: "Ford/Starcraft", model: "E-450/Allstar"}, //2022 Ford E-450 (Starcraft Allstar)
            count3019to3022: {count: 0, year: 2023, make: "Ford/Starcraft", model: "E-450/Allstar"}, //2023 Ford E-450 (Starcraft Allstar)
            count4501to4504: {count: 0, year: 2013, make: "Gillig", model: "Low Floor Trolley Replica", length: 29, fuel: "HEV"}, //2013 Gillig Trolley Replica HEV 29'
            count4505to4508: {count: 0, year: 2013, make: "Gillig", model: "Low Floor", length: 29, fuel: "HEV"}, //2013 Gillig Low Floor HEV 29'
            count4509to4513: {count: 0, year: 2013, make: "Gillig", model: "Low Floor", length: 35, fuel: "HEV"}, //2013 Gillig Low Floow HEV 35'
            count4514to4517: {count: 0, year: 2017, make: "Gillig", model: "Low Floor", length: 35, fuel: "CNG"}, //2017 Gillig Low Floor CNG 35'
            count4518to4521: {count: 0, year: 2018, make: "Gillig", model: "Low Floor", length: 29, fuel: "CNG"}, //2018 Gillig Low Floor CNG 29'
            count4522to4524: {count: 0, year: 2020, make: "Gillig", model: "Low Floor", length: 35, fuel: "CNG"}, //2020 Gillig Low Floor CNG 35'
            count5001to5120: {count: 0, year: 2014, make: "New Flyer", model: "Low Floor Restyled (C40LFR)", length: 40, fuel: "CNG"}, //2014 NFI C40LFR
            count5121to5200: {count: 0, year: 2015, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2015-2016 Gillig Low Floor CNG 40'
            count5241to5274: {count: 0, year: 2018, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2018 Gillig Low Floor CNG 40'
            count5275to5278: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2020 NFI XN40
            count5279to5318: {count: 0, year: 2023, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2023 Gillig Low Floor CNG 40'
            count5319to5336: {count: 0, year: 2023, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2023 Gillig Low Floor CNG 40'
            count5337to5353: {count: 0, year: 2024, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2024 Gillig Low Floor CNG 40'
            count5600to5611: {count: 0, year: 2018, make: "Gillig", model: "Low Floor", length: 40}, //2018 Gillig Low Floor 40'
            count5612to5644: {count: 0, year: 2019, make: "Gillig", model: "Low Floor", length: 40}, //2019 Gillig Low Floor 40'
            count5645to5661: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XD40)", length: 40, fuel: "Diesel"}, //2020 NFI XD40
            count5662to5691: {count: 0, year: 2021, make: "New Flyer", model: "Xcelsior (XD40)", length: 40, fuel: "Diesel"}, //2021 NFI XD40
            count5692to5711: {count: 0, year: 2024, make: "New Flyer", model: "Xcelsior (XDE40)", length: 40, fuel: "HEV"}, //2024 NFI XDE40
            count6676to6697: {count: 0, year: 2011, make: "New Flyer", model: "Low Floor Restyled (C40LFR)", length: 40, fuel: "CNG"}, //2011 NFI C40LFR
            count6698to6713: {count: 0, year: 2012, make: "New Flyer", model: "Low Floor Restyled (C40LFR)", length: 40, fuel: "CNG"}, //2012 NFI C40LFR
            count6714to6733: {count: 0, year: 2012, make: "New Flyer", model: "Low Floor Restyled Suburban (C40LFR)", length: 40, fuel: "CNG"}, //2012 NFI C40LFR (suburban)
            count6734to6749: {count: 0, year: 2012, make: "New Flyer", model: "Low Floor Restyled (C40LFR)", length: 40, fuel: "CNG"}, //2012 NFI C40LFR
            count6750to6758: {count: 0, year: 2016, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2016 Gillig Low Floor CNG 40'
            count6759to6670: {count: 0, year: 2017, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2017 Gillig Low Floor CNG 40'
            count6671to6810: {count: 0, year: 2018, make: "Gillig", model: "Low Floor", length: 40, fuel: "CNG"}, //2018 Gillig Low Floor CNG 40'
            count6811to6822: {count: 0, year: 2018, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2018 NFI XN40
            count6823to6846: {count: 0, year: 2019, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2019 NFI XN40
            count6847to6873: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2020 NFI XN40
            count6874to6885: {count: 0, year: 2021, make: "New Flyer", model: "Xcelsior (XD40)", length: 40, fuel: "Diesel"}, //2021 NFI XD40
            count6886to6898: {count: 0, year: 2021, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2021 NFI XN40
            count7001to7009: {count: 0, year: 2010, make: "New Flyer", model: "Low Floor Advanced (D40LFA)", length: 40, fuel: "Diesel"}, //2010 NFI D40LFA
            count7010to7013: {count: 0, year: 2020, make: "MCI", model: "D45CRT LE", length: 45, fuel: "Diesel"}, //2020 MCI D45CRT LE
            count7014to7033: {count: 0, year: 2021, make: "MCI", model: "D45CRT LE", length: 45, fuel: "Diesel"}, //2021 MCI D45CRT LE
            count7165to7172: {count: 0, year: 2016, make: "New Flyer", model: "Xcelsior (XN60)", length: 60, fuel: "CNG"}, //2016 NFI XN60 (RAPID)
            count7173to7174: {count: 0, year: 2018, make: "New Flyer", model: "Xcelsior (XN60)", length: 60, fuel: "CNG"}, //2018 NFI XN60 (RAPID)
            count7175to7185: {count: 0, year: 2019, make: "New Flyer", model: "Xcelsior (XN60)", length: 60, fuel: "CNG"}, //2019 NFI XN60 (RAPID)
            count7186to7192: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XN60)", length: 60, fuel: "CNG"}, //2020 NFI XN60 (RAPID)
            count7300to7309: {count: 0, year: 2017, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2017 NFI XN40 (RAPID)
            count7310to7323: {count: 0, year: 2019, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2019 NFI XN40 (RAPID)
            count7324to7328: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XN40)", length: 40, fuel: "CNG"}, //2020 NFI XN40 (RAPID)
            count8065to8081: {count: 0, year: 2011, make: "New Flyer", model: "Low Floor Restyled (DE60LFR)", length: 60, fuel: "HEV"}, //2011 NFI DE60LFR
            count8082to8101: {count: 0, year: 2016, make: "New Flyer", model: "Xcelsior (XD60)", length: 60, fuel: "Diesel"}, //2016 NFI XD60
            count8102to8121: {count: 0, year: 2017, make: "New Flyer", model: "Xcelsior (XD60)", length: 60, fuel: "Diesel"}, //2017 NFI XD60
            count8122to8127: {count: 0, year: 2019, make: "New Flyer", model: "Xcelsior (XD60)", length: 60, fuel: "Diesel"}, //2019 NFI XD60
            count8128to8155: {count: 0, year: 2020, make: "New Flyer", model: "Xcelsior (XD60)", length: 60, fuel: "Diesel"}, //2020 NFI XD60
            count8521to8530: {count: 0, year: 2017, make: "New Flyer", model: "Xcelsior (XN60)", length: 60, fuel: "CNG"}, //2017 NFI XN60
            unknown: {count: 0, make: "Unknown"},
        };



        vehicles.forEach(vehicle => {
            const vehicleId = vehicle.vehicle?.vehicle?.id;
            const routeId = vehicle.vehicle?.trip?.routeId;
            const finalDestination = vehicle.vehicle?.vehicle?.label;

            if (vehicleId && routeId) {
                const listItem = document.createElement("li");
                listItem.textContent = `${vehicleId} on route ${routeId} (final destination of ${finalDestination})`;

                //Count fleet numbers
                const idNum = parseInt(vehicleId, 10);
                //Light Rail/Streetcar Vehciles
                if(idNum >= 101 && idNum <= 150){
                    busFleet.count101to150.count++;
                }
                else if(idNum >=180 && idNum <= 185){
                    busFleet.count180to185.count++; //Streetcar does not have GTFS-RT tracking to my knowledge
                }
                else if(idNum >= 201 && idNum <= 225){
                    busFleet.count201to225.count++;
                }
                //BusFleet
                else if(idNum >= 1605 && idNum <= 1611) {
                    busFleet.count1605to1611.count++;
                }
                else if(idNum >= 1631 && idNum <= 1642) {
                    busFleet.count1631to1642.count++;
                }
                else if(idNum == 1612 || (idNum >= 1623 && idNum <= 1627)){
                    busFleet.count1612and1623to1627.count++;
                }
                else if(idNum >= 1617 && idNum <= 1622){
                    busFleet.count1617to1622.count++;
                }
                else if(idNum >=1628  && idNum <=1630){
                    busFleet.count1628to1630.count++;
                }
                else if(idNum >=1631  && idNum <=1642){
                    busFleet.count1631to1642.count++;
                }
                else if(idNum == 1643){
                    busFleet.count1643.count++;
                }
                else if(idNum>=1644  && idNum <=1649){
                    busFleet.count1644to1649.count++;
                }
                else if (idNum >= 1650 && idNum <= 1666) {
                    busFleet.count1650to1666.count++;
                } 
                else if (idNum >= 1667 && idNum <= 1672) {
                    busFleet.count1667to1672.count++;
                } 
                else if (idNum >= 3003 && idNum <= 3005) {
                    busFleet.count3003to3005.count++;
                } 
                else if (idNum >= 3006 && idNum <= 3008) {
                    busFleet.count3006to3008.count++;
                } 
                else if (idNum >= 3009 && idNum <= 3011) {
                    busFleet.count3009to3011.count++;
                } 
                else if (idNum >= 5319 && idNum <= 5336) {
                    busFleet.count5319to5336.count++;
                } 
                else if (idNum >= 5337 && idNum <= 5353) {
                    busFleet.count5337to5353.count++;
                } 
                else if (idNum >= 5600 && idNum <= 5611) {
                    busFleet.count5600to5611.count++;
                } 
                else if (idNum >= 5612 && idNum <= 5644) {
                    busFleet.count5612to5644.count++;
                } 
                else if (idNum >= 5645 && idNum <= 5661) {
                    busFleet.count5645to5661.count++;
                } 
                else if (idNum >= 5662 && idNum <= 5691) {
                    busFleet.count5662to5691.count++;
                } 
                else if (idNum >= 5692 && idNum <= 5711) {
                    busFleet.count5692to5711.count++;
                } 
                else if (idNum >= 6676 && idNum <= 6697) {
                    busFleet.count6676to6697.count++;
                } 
                else if (idNum >= 6698 && idNum <= 6713) {
                    busFleet.count6698to6713.count++;
                } 
                else if (idNum >= 6714 && idNum <= 6733) {
                    busFleet.count6714to6733.count++;
                } 
                else if (idNum >= 6734 && idNum <= 6749) {
                    busFleet.count6734to6749.count++;
                } 
                else if (idNum >= 6750 && idNum <= 6758) {
                    busFleet.count6750to6758.count++;
                } 
                else if (idNum >= 6759 && idNum <= 6670) {
                    busFleet.count6759to6670.count++;
                } 
                else if (idNum >= 6671 && idNum <= 6810) {
                    busFleet.count6671to6810.count++;
                } 
                else if (idNum >= 6811 && idNum <= 6822) {
                    busFleet.count6811to6822.count++;
                }
                else if(idNum >= 6823 && idNum <= 6846){
                    busFleet.count6823to6846.count++;
                }
                else if(idNum >= 6847 && idNum <= 6873){
                    busFleet.count6847to6873.count++;
                }
                else if(idNum >= 6874 && idNum <= 6885){
                    busFleet.count6874to6885.count++;
                }
                else if(idNum >= 6886 && idNum <= 6898){
                    busFleet.count6886to6898.count++;
                }
                else if(idNum >= 7001 && idNum <= 7009){
                    busFleet.count7001to7009.count++;
                }
                else if(idNum >= 7010 && idNum <= 7013) {
                    busFleet.count7010to7013.count++;
                }
                else if(idNum >= 7014 && idNum <= 7033){
                    busFleet.count7014to7033.count++;
                }
                else if(idNum >= 7165 && idNum <= 7172){
                    busFleet.count7165to7172.count++;
                }
                else if(idNum >= 7173 && idNum <= 7174){
                    busFleet.count7173to7174.count++;
                }
                else if(idNum >= 7175 && idNum <= 1785){
                    busFleet.count7175to7185.count++;
                }
                else if(idNum >= 7186 && idNum <= 7192){
                    busFleet.count7186to7192.count++;
                }
                else if(idNum >= 7300 && idNum <= 7309){
                    busFleet.count7300to7309.count++;
                }
                else if(idNum >= 7310 && idNum <= 7323){
                    busFleet.count7310to7323.count++;
                }
                else if(idNum >= 7324 && idNum <= 7328){
                    busFleet.count7324to7328.count++;
                }
                else if(idNum >= 8065 && idNum <= 8081){
                    busFleet.count8065to8081.count++;
                }
                else if(idNum >= 8082 && idNum <= 8101){
                    busFleet.count8082to8101.count++;
                }
                else if(idNum >= 8102 && idNum <= 8121){
                    busFleet.count8102to8121.count++;
                }
                else if(idNum >= 8122 && idNum <= 8127){
                    busFleet.count8122to8127.count++;
                }
                else if(idNum >= 8128 && idNum <= 8155){
                    busFleet.count8128to8155.count++;
                }
                else if(idNum >= 8521 && idNum <= 8530){
                    busFleet.count8521to8530.count++;
                }
                else {
                    busFleet.unknown.count++;
                }

                busList.appendChild(listItem);
            }
        });

        console.log("Vehicles:", vehicles);
        console.log("Bus Fleet Count:", busFleet);

        //Print out by Make/Model
        for(const key in busFleet){
            if(busFleet[key].count > 0){
                if(key === "unknown"){
                    busSummary.innerHTML += `${busFleet[key].count} - ${busFleet[key].make} <br>`;
                }
                else if(busFleet[key].fuel != null || busFleet[key].length != null){
                    if(busFleet[key].fuel != null && busFleet[key].length == null){
                        busSummary.innerHTML += `${busFleet[key].count} - ${busFleet[key].year} ${busFleet[key].make} ${busFleet[key].model} ${busFleet[key].fuel} <br>`;
                    }
                    else if(busFleet[key].fuel == null && busFleet[key].length != null){
                        busSummary.innerHTML += `${busFleet[key].count} - ${busFleet[key].year} ${busFleet[key].make} ${busFleet[key].model} ${busFleet[key].length}' <br>`;
                    }
                    else{
                        busSummary.innerHTML += `${busFleet[key].count} - ${busFleet[key].year} ${busFleet[key].make} ${busFleet[key].model} ${busFleet[key].length}' ${busFleet[key].fuel} <br>`;  
                    }
                }
                else {
                    busSummary.innerHTML += `${busFleet[key].count} - ${busFleet[key].year} ${busFleet[key].make} ${busFleet[key].model} <br>`;
                }
            }
        }

    } 
    catch (error) {
        console.error("Error fetching bus data:", error);
    }
}
fetchBusData();

//Refresh Every Minute
setInterval(fetchBusData, 60000);
window.addEventListener("beforeunload", () => clearInterval(intervalId));