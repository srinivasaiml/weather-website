let map;
        let markers = {};
        let activeLocation = null;
        let trafficChart, aqiChart;

        // Location data
        const locations = [
            {
                id: 'godavari',
                name: 'Godavari River Monitoring',
                coords: [16.9891, 81.7775],
                type: 'environment',
                icon: 'fa-water',
                color: '#2196F3',
                data: {
                    level: '15.2m',
                    flow: '2,450 m³/s',
                    temp: '26°C',
                    status: 'Normal'
                }
            },
            {
                id: 'gtroad',
                name: 'GT Road Junction',
                coords: [16.9984, 81.7902],
                type: 'traffic',
                icon: 'fa-traffic-light',
                color: '#FF9800',
                data: {
                    vehicles: '847',
                    congestion: '42%',
                    avgSpeed: '35 km/h',
                    status: 'Moderate'
                }
            },
            {
                id: 'mainbazar',
                name: 'Main Bazar Area',
                coords: [16.9950, 81.7850],
                type: 'traffic',
                icon: 'fa-car',
                color: '#FF5722',
                data: {
                    vehicles: '1,124',
                    congestion: '68%',
                    avgSpeed: '18 km/h',
                    status: 'Heavy'
                }
            },
            {
                id: 'aqi1',
                name: 'Air Quality Station 1',
                coords: [17.0020, 81.7700],
                type: 'environment',
                icon: 'fa-wind',
                color: '#4CAF50',
                data: {
                    aqi: '68',
                    pm25: '42 μg/m³',
                    pm10: '58 μg/m³',
                    status: 'Moderate'
                }
            },
            {
                id: 'hospital',
                name: 'City Hospital',
                coords: [16.9870, 81.7820],
                type: 'emergency',
                icon: 'fa-hospital',
                color: '#f44336',
                data: {
                    beds: '89/120',
                    emergencies: '12',
                    ambulances: '8',
                    status: 'Active'
                }
            },
            {
                id: 'firestation',
                name: 'Fire Station Central',
                coords: [17.0000, 81.7950],
                type: 'emergency',
                icon: 'fa-fire-extinguisher',
                color: '#e91e63',
                data: {
                    units: '6',
                    onDuty: '4',
                    responseTime: '4.2 min',
                    status: 'Ready'
                }
            },
            {
                id: 'weather1',
                name: 'Weather Station Downtown',
                coords: [16.9920, 81.7880],
                type: 'environment',
                icon: 'fa-cloud-sun',
                color: '#00BCD4',
                data: {
                    temp: '28°C',
                    humidity: '65%',
                    wind: '12 km/h',
                    status: 'Partly Cloudy'
                }
            },
            {
                id: 'parking1',
                name: 'Central Parking Complex',
                coords: [16.9960, 81.7760],
                type: 'traffic',
                icon: 'fa-parking',
                color: '#9C27B0',
                data: {
                    available: '47/200',
                    occupied: '76%',
                    revenue: '₹12,450',
                    status: 'Nearly Full'
                }
            }
        ];

        // Initialize Map
        function initMap() {
            map = L.map('cityMap').setView([16.9891, 81.7775], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add markers for all locations
            locations.forEach(location => {
                const marker = L.marker(location.coords, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background: ${location.color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid white; cursor: pointer;" class="pulse">
                            <i class="fas ${location.icon}"></i>
                        </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    })
                }).addTo(map);

                marker.on('click', () => showLocationDetails(location));
                markers[location.id] = marker;
            });
        }

        // Show location details
        function showLocationDetails(location) {
            activeLocation = location;
            
            const panel = document.getElementById('locationPanel');
            const dataEntries = Object.entries(location.data);
            
            panel.innerHTML = `
                <div class="location-card">
                    <div class="location-header">
                        <div class="location-icon" style="background: ${location.color};">
                            <i class="fas ${location.icon}"></i>
                        </div>
                        <div class="location-info">
                            <h4>${location.name}</h4>
                            <p><i class="fas fa-map-pin"></i> ${location.coords[0].toFixed(4)}, ${location.coords[1].toFixed(4)}</p>
                        </div>
                    </div>
                    <div class="location-stats">
                        ${dataEntries.map(([key, value]) => `
                            <div class="location-stat">
                                <div class="location-stat-value">${value}</div>
                                <div class="location-stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${location.type === 'environment' ? `
                    <div class="location-card" style="margin-top: 1rem;">
                        <h4 style="color: var(--dark); margin-bottom: 1rem;">
                            <i class="fas fa-cloud-sun"></i> Weather Details
                        </h4>
                        <div class="location-stats">
                            <div class="location-stat">
                                <div class="location-stat-value">${Math.floor(Math.random() * 5 + 26)}°C</div>
                                <div class="location-stat-label">Temperature</div>
                            </div>
                            <div class="location-stat">
                                <div class="location-stat-value">${Math.floor(Math.random() * 20 + 60)}%</div>
                                <div class="location-stat-label">Humidity</div>
                            </div>
                            <div class="location-stat">
                                <div class="location-stat-value">${Math.floor(Math.random() * 10 + 5)} km/h</div>
                                <div class="location-stat-label">Wind Speed</div>
                            </div>
                            <div class="location-stat">
                                <div class="location-stat-value">${Math.floor(Math.random() * 20 + 1000)} hPa</div>
                                <div class="location-stat-label">Pressure</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div class="location-card" style="margin-top: 1rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(33, 150, 243, 0.1));">
                    <h4 style="color: var(--dark); margin-bottom: 0.5rem;">
                        <i class="fas fa-clock"></i> Last Updated
                    </h4>
                    <p style="color: #666;">${new Date().toLocaleTimeString()}</p>
                    <button onclick="refreshLocationData()" style="margin-top: 1rem; width: 100%; padding: 0.75rem; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        <i class="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
            `;

            map.setView(location.coords, 15);
            addAlert('info', `Viewing ${location.name}`, `Location details loaded successfully`);
        }

        // Refresh location data
        function refreshLocationData() {
            if (activeLocation) {
                showLocationDetails(activeLocation);
                addAlert('success', 'Data Refreshed', `Updated data for ${activeLocation.name}`);
            }
        }

        // Initialize Traffic Chart with live animation
        let trafficChartMode = '24h';
        let trafficDataPoints = Array(20).fill().map(() => Math.floor(Math.random() * 1500 + 500));
        
        function initTrafficChart() {
            const ctx = document.getElementById('trafficChart').getContext('2d');
            trafficChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(20).fill().map((_, i) => `${new Date().getHours()}:${String(new Date().getMinutes() - (19 - i) * 3).padStart(2, '0')}`),
                    datasets: [{
                        label: 'Vehicles/Hour',
                        data: trafficDataPoints,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        borderWidth: 3,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#667eea',
                        pointHoverBorderColor: 'white',
                        pointHoverBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2.5,
                    animation: {
                        duration: 750,
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: { size: 12, weight: '600' },
                                color: '#1a1a2e'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1a1a2e',
                            bodyColor: '#666',
                            borderColor: '#667eea',
                            borderWidth: 2,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `Vehicles: ${context.parsed.y}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#666', font: { size: 11 }, maxRotation: 0 }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { color: '#666', font: { size: 11 } }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
            
            // Start live animation
            startTrafficAnimation();
        }
        
        function startTrafficAnimation() {
            setInterval(() => {
                if (trafficChartMode === '24h') {
                    // Add new data point
                    const lastValue = trafficDataPoints[trafficDataPoints.length - 1];
                    const change = Math.floor(Math.random() * 200 - 100);
                    const newValue = Math.max(300, Math.min(2000, lastValue + change));
                    
                    trafficDataPoints.push(newValue);
                    trafficDataPoints.shift();
                    
                    // Update labels with current time
                    const now = new Date();
                    const labels = Array(20).fill().map((_, i) => {
                        const time = new Date(now - (19 - i) * 180000); // 3 minutes apart
                        return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
                    });
                    
                    trafficChart.data.labels = labels;
                    trafficChart.data.datasets[0].data = [...trafficDataPoints];
                    trafficChart.update('none'); // Smooth update without animation
                }
            }, 3000); // Update every 3 seconds for smooth flow
        }

        // Initialize AQI Chart with live animation
        let aqiChartMode = '24h';
        let aqiDataPoints = Array(20).fill().map(() => Math.floor(Math.random() * 80 + 20));
        
        function initAQIChart() {
            const ctx = document.getElementById('aqiChart').getContext('2d');
            aqiChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array(20).fill().map((_, i) => `${new Date().getHours()}:${String(new Date().getMinutes() - (19 - i) * 3).padStart(2, '0')}`),
                    datasets: [{
                        label: 'AQI',
                        data: aqiDataPoints,
                        backgroundColor: function(context) {
                            const value = context.parsed.y;
                            if (value > 100) return 'rgba(244, 67, 54, 0.7)';
                            if (value > 75) return 'rgba(255, 152, 0, 0.7)';
                            return 'rgba(76, 175, 80, 0.7)';
                        },
                        borderColor: function(context) {
                            const value = context.parsed.y;
                            if (value > 100) return '#f44336';
                            if (value > 75) return '#FF9800';
                            return '#4CAF50';
                        },
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2.5,
                    animation: {
                        duration: 750,
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: { size: 12, weight: '600' },
                                color: '#1a1a2e'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1a1a2e',
                            bodyColor: '#666',
                            borderColor: '#4CAF50',
                            borderWidth: 2,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    let status = 'Good';
                                    if (value > 100) status = 'Unhealthy';
                                    else if (value > 75) status = 'Moderate';
                                    return `AQI: ${value} (${status})`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#666', font: { size: 11 }, maxRotation: 0 }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0, 0, 0, 0.05)' },
                            ticks: { color: '#666', font: { size: 11 } }
                        }
                    }
                }
            });
            
            // Start live animation
            startAQIAnimation();
        }
        
        function startAQIAnimation() {
            setInterval(() => {
                if (aqiChartMode === '24h') {
                    // Add new data point
                    const lastValue = aqiDataPoints[aqiDataPoints.length - 1];
                    const change = Math.floor(Math.random() * 20 - 10);
                    const newValue = Math.max(20, Math.min(150, lastValue + change));
                    
                    aqiDataPoints.push(newValue);
                    aqiDataPoints.shift();
                    
                    // Update labels with current time
                    const now = new Date();
                    const labels = Array(20).fill().map((_, i) => {
                        const time = new Date(now - (19 - i) * 180000); // 3 minutes apart
                        return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
                    });
                    
                    aqiChart.data.labels = labels;
                    aqiChart.data.datasets[0].data = [...aqiDataPoints];
                    aqiChart.update('none'); // Smooth update without animation
                }
            }, 3000); // Update every 3 seconds
        }

        // Update Traffic Chart
        function updateTrafficChart(period) {
            document.querySelectorAll('#trafficChart').closest('.chart-container').querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            trafficChartMode = period;
            let labels, data;
            
            if (period === '24h') {
                // Switch to live streaming mode
                const now = new Date();
                labels = Array(20).fill().map((_, i) => {
                    const time = new Date(now - (19 - i) * 180000);
                    return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
                });
                trafficDataPoints = Array(20).fill().map(() => Math.floor(Math.random() * 1500 + 500));
                data = [...trafficDataPoints];
            } else if (period === '7d') {
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = Array(7).fill().map(() => Math.floor(Math.random() * 12000 + 8000));
            } else {
                labels = Array(30).fill().map((_, i) => `Day ${i + 1}`);
                data = Array(30).fill().map(() => Math.floor(Math.random() * 15000 + 5000));
            }

            trafficChart.data.labels = labels;
            trafficChart.data.datasets[0].data = data;
            trafficChart.update();
            
            addAlert('info', 'Chart Updated', `Showing ${period === '24h' ? 'live' : 'historical'} traffic data for ${period.toUpperCase()}`);
        }

        // Update AQI Chart
        function updateAQIChart(period) {
            document.querySelectorAll('#aqiChart').closest('.chart-container').querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            aqiChartMode = period;
            let labels, data;
            
            if (period === '24h') {
                // Switch to live streaming mode
                const now = new Date();
                labels = Array(20).fill().map((_, i) => {
                    const time = new Date(now - (19 - i) * 180000);
                    return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
                });
                aqiDataPoints = Array(20).fill().map(() => Math.floor(Math.random() * 80 + 20));
                data = [...aqiDataPoints];
            } else if (period === '7d') {
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = Array(7).fill().map(() => Math.floor(Math.random() * 100 + 30));
            } else {
                labels = Array(30).fill().map((_, i) => `Day ${i + 1}`);
                data = Array(30).fill().map(() => Math.floor(Math.random() * 120 + 20));
            }

            aqiChart.data.labels = labels;
            aqiChart.data.datasets[0].data = data;
            aqiChart.update();
            
            addAlert('info', 'Chart Updated', `Showing ${period === '24h' ? 'live' : 'historical'} AQI data for ${period.toUpperCase()}`);
        }

        // Map layer filter
        document.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const layer = this.dataset.layer;
                
                Object.keys(markers).forEach(key => {
                    const location = locations.find(l => l.id === key);
                    if (layer === 'all' || location.type === layer) {
                        map.addLayer(markers[key]);
                    } else {
                        map.removeLayer(markers[key]);
                    }
                });

                addAlert('info', 'Layer Updated', `Showing ${layer} markers`);
            });
        });

        // Add alert
        function addAlert(type, title, message) {
            const alertsList = document.getElementById('alertsList');
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${type}`;
            
            const icons = {
                info: 'fa-info-circle',
                warning: 'fa-exclamation-triangle',
                danger: 'fa-exclamation-circle',
                success: 'fa-check-circle'
            };
            
            alertItem.innerHTML = `
                <div class="alert-icon ${type}">
                    <i class="fas ${icons[type]}"></i>
                </div>
                <div class="alert-content">
                    <h4>${title}</h4>
                    <p>${message}</p>
                    <div class="alert-time">${new Date().toLocaleTimeString()}</div>
                </div>
            `;
            
            alertsList.insertBefore(alertItem, alertsList.firstChild);
            
            if (alertsList.children.length > 8) {
                alertsList.removeChild(alertsList.lastChild);
            }

            setTimeout(() => {
                alertItem.style.opacity = '0';
                alertItem.style.transform = 'translateX(-20px)';
                setTimeout(() => alertItem.remove(), 300);
            }, 10000);
        }

        // Clear alerts
        function clearAlerts() {
            const alertsList = document.getElementById('alertsList');
            alertsList.innerHTML = `
                <div class="alert-item success">
                    <div class="alert-icon success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="alert-content">
                        <h4>All Clear</h4>
                        <p>All alerts have been cleared</p>
                        <div class="alert-time">Just now</div>
                    </div>
                </div>
            `;
        }

        // Update dashboard stats
        function updateStats() {
            // River Level
            const riverLevel = (14 + Math.random() * 3).toFixed(1);
            document.getElementById('riverLevel').textContent = riverLevel + 'm';
            
            // AQI
            const aqi = Math.floor(30 + Math.random() * 100);
            document.getElementById('aqiValue').textContent = aqi;
            
            // Traffic
            const traffic = Math.floor(800 + Math.random() * 800);
            document.getElementById('trafficCount').textContent = traffic.toLocaleString();
            
            // Temperature
            const temp = Math.floor(25 + Math.random() * 8);
            document.getElementById('tempValue').textContent = temp + '°C';

            // Random alerts
            if (Math.random() > 0.85) {
                const alertTypes = [
                    { type: 'info', title: 'Traffic Update', message: 'Light traffic on main roads' },
                    { type: 'warning', title: 'Weather Alert', message: 'High temperatures expected today' },
                    { type: 'success', title: 'System Status', message: 'All sensors operational' },
                    { type: 'info', title: 'River Monitoring', message: 'Water level within normal range' }
                ];
                const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                addAlert(alert.type, alert.title, alert.message);
            }
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.dataset.view;
                addAlert('info', 'Navigation', `Switched to ${view} view`);
            });
        });

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function() {
            initMap();
            initTrafficChart();
            initAQIChart();
            updateStats();
            
            setInterval(updateStats, 5000);
            
            addAlert('success', 'System Online', 'Dashboard initialized successfully');
            
            setTimeout(() => {
                addAlert('info', 'Welcome', 'Click on map markers to view location details');
            }, 2000);
        });