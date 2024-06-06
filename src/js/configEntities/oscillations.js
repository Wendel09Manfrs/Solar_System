export const bodies = {
  sun: {
    ia: 0.037 * Math.random() + 0.013,
    ifreq: Math.round(21 * Math.random() + 6),
    ra: 18000000 * Math.random() + 8000000,
    rfreq: Math.round(8 * Math.random() + 6),
    precession: 0
  },
  mercury: {
    ia: 0.0002,
    ifreq: 0.02,
    ra: 0.03 * Math.random() + 0.015,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 2.787676e-5
  },
  venus: {
    ia: 0.0001,
    ifreq: 0.015,
    ra: 0.025 * Math.random() + 0.012,
    rfreq: Math.round(2 * Math.random() + 1),
    precession:9.93867e-6
  },
  earth: {
    ia: 0.001,
    ifreq: 0.337,
    ra: 0.001 * Math.random() + 0.0007,
    rfreq: Math.round(6 * Math.random() + 2),
    precession:5.551e-5
  },
  moon: {
    ia: 0.001,
    ifreq: 0.0127,
    ra: 0.0002 * Math.random(),
    rfreq: Math.round(0.01 * Math.random() + 0.001),
    precession: 0.002243
  },
  mars: {
    ia: 0.0005,
    ifreq: 0.05,
    ra: 0.005 * Math.random() + 0.003,
    rfreq: Math.round(5 * Math.random() + 1),
    precession:7.89e-5
  },
  jupiter: {
    ia: 0.0001,
    ifreq: 0.002,
    ra: 0.005 * Math.random() + 0.002,
    rfreq: Math.round(3 * Math.random() + 1),
    precession:3.1755e-5
  },
  saturn: {
    ia: 0.0001,
    ifreq: 0.0015,
    ra: 0.004 * Math.random() + 0.0015,
    rfreq: Math.round(3 * Math.random() + 1),
    precession:9.4538e-5
  },
  uranus: {
    ia: 0.0002,
    ifreq: 0.001,
    ra: 0.003 * Math.random() + 0.001,
    rfreq: Math.round(2 * Math.random() + 1),
    precession:1.6677e-5
  },
  neptune: {
    ia: 0.0002,
    ifreq: 0.001,
    ra: 0.0003 * Math.random() + 0.001,
    rfreq: Math.round(2 * Math.random() + 1),
    precession:1.7453e-6
  },
  pluto: {
    ia: 0.0003,
    ifreq: 0.003,
    ra: 0.00013 * Math.random() + 0.0018,
    rfreq: Math.round(2 * Math.random() + 1),
    precession: 1.972*1e-5*1.67 //value neptune influence * random number
  },
  europa: {
    ia: 0.0001,
    ifreq: 0.0009,
    ra: 0.00012 * Math.random(),
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 0.78e-6
  },
  callisto: {
    ia: 0.0001,
    ifreq: 0.0005,
    ra: 0.00013 * Math.random(),
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 0.56e-6
  },
  ganymede: {
    ia: 0.0001,
    ifreq: 0.0002,
    ra: 0.00013 * Math.random() + 0.001,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 1.25e-6
  },
  io: {
    ia: 0.0001,
    ifreq: 0.0003,
    ra: 1e-4,
    rfreq: Math.round(0.03 * Math.random() + 0.01),
    precession: 3.15e-6
  },
  dione: {
    ia: 0.0001,
    ifreq: 0.001,
    ra: 0.0002 * Math.random() + 0.001,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 6.6e-8
  },
  iapetus: {
    ia: 0.0001,
    ifreq: 0.0007,
    ra: 0.0002 * Math.random() + 0.001,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 5.858e-6
  },
  titan: {
    ia: 0.0001,
    ifreq: 0.0015,
    ra: 0.0002 * Math.random() + 0.001,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 2.8457e-5
  },
  rhea: {
    ia: 0.0001,
    ifreq: 0.0008,
    ra: 0.0002 * Math.random() + 0.001,
    rfreq: Math.round(3 * Math.random() + 1),
    precession: 2.15e-6
  },
  halley: {
    ia: 0,
    ifreq: 0,
    ra: 0,
    rfreq: 0,
    precession: 1.12e-4  //random, but with a certain notion 
  }
  
}
