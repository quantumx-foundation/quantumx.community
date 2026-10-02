export const areas = [
  "Foundations",
  "Algorithms",
  "Hardware and error correction",
  "Quantum machine learning",
  "Cryptography",
  "Tools and SDKs",
] as const;

export const resourceTypes = ["Course", "Book", "Paper", "Tool", "Video", "Workshop recording"] as const;

export type Area = (typeof areas)[number];
export type ResourceType = (typeof resourceTypes)[number];

export type Resource = {
  title: string;
  /** Authors or publisher. */
  by: string;
  url: string;
  area: Area;
  type: ResourceType;
  /** One line on why it's worth your time. */
  note: string;
  level: "Beginner" | "Intermediate" | "Advanced";
};

/**
 * The resource library at /resources. Add to it freely: it's grouped by area
 * and filtered by type on the page, so order within an area is the order shown.
 * QuantumX workshop recordings go in as type "Workshop recording".
 */
export const resources: Resource[] = [
  // Foundations
  {
    title: "Basics of Quantum Information",
    by: "John Watrous, IBM Quantum Learning",
    url: "https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information",
    area: "Foundations",
    type: "Course",
    note: "The cleanest free start: qubits, measurement and entanglement, with the maths shown properly.",
    level: "Beginner",
  },
  {
    title: "Quantum Country",
    by: "Andy Matuschak and Michael Nielsen",
    url: "https://quantum.country/",
    area: "Foundations",
    type: "Course",
    note: "Essays with built-in spaced repetition, so what you read actually sticks.",
    level: "Beginner",
  },
  {
    title: "PennyLane Codebook",
    by: "Xanadu",
    url: "https://pennylane.ai/codebook",
    area: "Foundations",
    type: "Course",
    note: "Short lessons where you write the code as you go, from single qubits to Shor.",
    level: "Beginner",
  },
  {
    title: "Quantum Computation and Quantum Information",
    by: "Michael Nielsen and Isaac Chuang",
    url: "https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE",
    area: "Foundations",
    type: "Book",
    note: "\"Mike and Ike\". The textbook the whole field learned from.",
    level: "Intermediate",
  },
  {
    title: "Lecture notes for Physics 219/229: Quantum Computation",
    by: "John Preskill, Caltech",
    url: "https://www.preskill.caltech.edu/ph229/",
    area: "Foundations",
    type: "Course",
    note: "Free, rigorous notes from one of the people who named the field's big ideas.",
    level: "Advanced",
  },

  // Algorithms
  {
    title: "Quantum Algorithm Zoo",
    by: "Stephen Jordan",
    url: "https://quantumalgorithmzoo.org/",
    area: "Algorithms",
    type: "Tool",
    note: "A catalogue of every known quantum algorithm and the speedup it offers.",
    level: "Intermediate",
  },
  {
    title: "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer",
    by: "Peter Shor, 1994",
    url: "https://arxiv.org/abs/quant-ph/9508027",
    area: "Algorithms",
    type: "Paper",
    note: "Shor's algorithm. The paper that made everyone take quantum computing seriously.",
    level: "Advanced",
  },
  {
    title: "A fast quantum mechanical algorithm for database search",
    by: "Lov Grover, 1996",
    url: "https://arxiv.org/abs/quant-ph/9605043",
    area: "Algorithms",
    type: "Paper",
    note: "Grover's search: a square-root speedup for unstructured search, in five pages.",
    level: "Intermediate",
  },
  {
    title: "Quantum algorithm for solving linear systems of equations",
    by: "Harrow, Hassidim and Lloyd, 2008",
    url: "https://arxiv.org/abs/0811.3171",
    area: "Algorithms",
    type: "Paper",
    note: "HHL. The root of most claims about quantum speedups for linear algebra.",
    level: "Advanced",
  },
  {
    title: "A variational eigenvalue solver on a quantum processor",
    by: "Peruzzo et al., 2013",
    url: "https://arxiv.org/abs/1304.3061",
    area: "Algorithms",
    type: "Paper",
    note: "VQE, the hybrid quantum-classical loop behind most chemistry work today.",
    level: "Intermediate",
  },
  {
    title: "A Quantum Approximate Optimization Algorithm",
    by: "Farhi, Goldstone and Gutmann, 2014",
    url: "https://arxiv.org/abs/1411.4028",
    area: "Algorithms",
    type: "Paper",
    note: "QAOA, the go-to algorithm for optimisation problems on near-term hardware.",
    level: "Intermediate",
  },
  {
    title: "Quantum Computing in the NISQ era and beyond",
    by: "John Preskill, 2018",
    url: "https://arxiv.org/abs/1801.00862",
    area: "Algorithms",
    type: "Paper",
    note: "Where the term NISQ comes from, and an honest look at what near-term machines can do.",
    level: "Beginner",
  },

  // Hardware and error correction
  {
    title: "The Physical Implementation of Quantum Computation",
    by: "David DiVincenzo, 2000",
    url: "https://arxiv.org/abs/quant-ph/0002077",
    area: "Hardware and error correction",
    type: "Paper",
    note: "The DiVincenzo criteria: what any physical system needs to be a quantum computer.",
    level: "Beginner",
  },
  {
    title: "A Quantum Engineer's Guide to Superconducting Qubits",
    by: "Krantz et al., 2019",
    url: "https://arxiv.org/abs/1904.06560",
    area: "Hardware and error correction",
    type: "Paper",
    note: "How transmons are designed, controlled and read out. The engineer's reference.",
    level: "Advanced",
  },
  {
    title: "Quantum supremacy using a programmable superconducting processor",
    by: "Arute et al. (Google), Nature 2019",
    url: "https://doi.org/10.1038/s41586-019-1666-5",
    area: "Hardware and error correction",
    type: "Paper",
    note: "Sycamore, and the first claim of a quantum computer beating a classical one at anything.",
    level: "Intermediate",
  },
  {
    title: "Surface codes: Towards practical large-scale quantum computation",
    by: "Fowler et al., 2012",
    url: "https://arxiv.org/abs/1208.0928",
    area: "Hardware and error correction",
    type: "Paper",
    note: "The long, careful introduction to the error-correcting code most hardware is betting on.",
    level: "Advanced",
  },
  {
    title: "Quantum error correction below the surface code threshold",
    by: "Google Quantum AI, 2024",
    url: "https://arxiv.org/abs/2408.13687",
    area: "Hardware and error correction",
    type: "Paper",
    note: "Willow: adding qubits finally made the logical qubit better, not worse.",
    level: "Advanced",
  },

  // Quantum machine learning
  {
    title: "An introduction to quantum machine learning",
    by: "Schuld, Sinayskiy and Petruccione, 2014",
    url: "https://arxiv.org/abs/1409.3097",
    area: "Quantum machine learning",
    type: "Paper",
    note: "A gentle survey to read before anything else in QML.",
    level: "Beginner",
  },
  {
    title: "Quantum Machine Learning",
    by: "Biamonte et al., Nature 2017",
    url: "https://arxiv.org/abs/1611.09347",
    area: "Quantum machine learning",
    type: "Paper",
    note: "The widely cited review of where quantum could help machine learning.",
    level: "Intermediate",
  },
  {
    title: "Supervised learning with quantum enhanced feature spaces",
    by: "Havlíček et al., 2018",
    url: "https://arxiv.org/abs/1804.11326",
    area: "Quantum machine learning",
    type: "Paper",
    note: "Quantum kernels and variational classifiers, run on real hardware.",
    level: "Intermediate",
  },
  {
    title: "Barren plateaus in quantum neural network training landscapes",
    by: "McClean et al., 2018",
    url: "https://arxiv.org/abs/1803.11173",
    area: "Quantum machine learning",
    type: "Paper",
    note: "Why many quantum neural networks are hard to train, and the problem the field is still working on.",
    level: "Advanced",
  },
  {
    title: "PennyLane demos",
    by: "Xanadu",
    url: "https://pennylane.ai/qml/demonstrations",
    area: "Quantum machine learning",
    type: "Tool",
    note: "Hundreds of runnable notebooks covering QML, chemistry and optimisation.",
    level: "Beginner",
  },

  // Cryptography
  {
    title: "Quantum cryptography: Public key distribution and coin tossing",
    by: "Charles Bennett and Gilles Brassard, 1984",
    url: "https://arxiv.org/abs/2003.06557",
    area: "Cryptography",
    type: "Paper",
    note: "BB84, the first quantum key distribution protocol. Short and readable.",
    level: "Beginner",
  },
  {
    title: "Quantum cryptography based on Bell's theorem",
    by: "Artur Ekert, 1991",
    url: "https://doi.org/10.1103/PhysRevLett.67.661",
    area: "Cryptography",
    type: "Paper",
    note: "E91: key distribution secured by entanglement itself.",
    level: "Intermediate",
  },
  {
    title: "How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits",
    by: "Craig Gidney and Martin Ekerå, 2019",
    url: "https://arxiv.org/abs/1905.09749",
    area: "Cryptography",
    type: "Paper",
    note: "A concrete estimate of what it would take to break RSA, and why it matters now.",
    level: "Advanced",
  },
  {
    title: "Post-Quantum Cryptography",
    by: "NIST",
    url: "https://csrc.nist.gov/projects/post-quantum-cryptography",
    area: "Cryptography",
    type: "Tool",
    note: "The standards process choosing the encryption that should survive quantum computers.",
    level: "Beginner",
  },
  {
    title: "FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism",
    by: "NIST, 2024",
    url: "https://csrc.nist.gov/pubs/fips/203/final",
    area: "Cryptography",
    type: "Paper",
    note: "ML-KEM (Kyber), the first finished post-quantum encryption standard.",
    level: "Advanced",
  },

  // Tools and SDKs
  {
    title: "Qiskit",
    by: "IBM",
    url: "https://github.com/Qiskit/qiskit",
    area: "Tools and SDKs",
    type: "Tool",
    note: "The most widely used quantum SDK, with free access to IBM's real hardware.",
    level: "Beginner",
  },
  {
    title: "Cirq",
    by: "Google Quantum AI",
    url: "https://quantumai.google/cirq",
    area: "Tools and SDKs",
    type: "Tool",
    note: "Google's Python framework for writing and simulating circuits close to the hardware.",
    level: "Intermediate",
  },
  {
    title: "PennyLane",
    by: "Xanadu",
    url: "https://pennylane.ai/",
    area: "Tools and SDKs",
    type: "Tool",
    note: "Differentiable quantum programming that plugs into PyTorch and JAX.",
    level: "Beginner",
  },
  {
    title: "CUDA-Q",
    by: "NVIDIA",
    url: "https://developer.nvidia.com/cuda-q",
    area: "Tools and SDKs",
    type: "Tool",
    note: "GPU-accelerated simulation and hybrid quantum-classical programming.",
    level: "Intermediate",
  },
  {
    title: "Amazon Braket",
    by: "AWS",
    url: "https://aws.amazon.com/braket/",
    area: "Tools and SDKs",
    type: "Tool",
    note: "One SDK for hardware from several vendors: ions, neutral atoms and superconducting.",
    level: "Intermediate",
  },
  {
    title: "QuTiP",
    by: "QuTiP community",
    url: "https://qutip.org/",
    area: "Tools and SDKs",
    type: "Tool",
    note: "Simulate open quantum systems: noise, decay and the physics under the qubits.",
    level: "Advanced",
  },
  {
    title: "Quirk",
    by: "Craig Gidney",
    url: "https://algassert.com/quirk",
    area: "Tools and SDKs",
    type: "Tool",
    note: "A drag-and-drop circuit simulator in the browser. The fastest way to build intuition.",
    level: "Beginner",
  },
  {
    title: "Qiskit on YouTube",
    by: "IBM",
    url: "https://www.youtube.com/@qiskit",
    area: "Tools and SDKs",
    type: "Video",
    note: "Years of lectures, summer school recordings and coding walkthroughs.",
    level: "Beginner",
  },
];
