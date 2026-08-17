<?php

declare(strict_types=1);

class MLPPredictor {
    private array $weights;
    private array $biases;
    private array $scalerX;
    private array $scalerY;
    public array $inputFeatures;
    public array $targetFeatures;
    public array $metrics;

    public function __construct(string $jsonPath) {
        if (!file_exists($jsonPath)) {
            throw new Exception("Model weights file not found: " . $jsonPath);
        }
        $data = json_decode(file_get_contents($jsonPath), true);
        if (!$data) {
            throw new Exception("Invalid JSON format in model weights file.");
        }

        $this->weights = $data['weights'];
        $this->biases = $data['biases'];
        $this->scalerX = $data['scaler_X'];
        $this->scalerY = $data['scaler_y'];
        $this->inputFeatures = $data['input_features'];
        $this->targetFeatures = $data['target_features'];
        $this->metrics = $data['metrics'];
    }

    /**
     * Performs inference (prediction) using the neural network weights.
     * @param array $inputs Associative array or indexed array of input features matching inputFeatures order.
     * @return array Associative array of predictions matching targetFeatures.
     */
    public function predict(array $inputs): array {
        // 1. Prepare and scale inputs
        $x = [];
        // If inputs is an associative array, extract in correct order, otherwise assume it's already in order.
        $isAssoc = array_keys($inputs) !== range(0, count($inputs) - 1);
        foreach ($this->inputFeatures as $i => $feature) {
            $val = $isAssoc ? ($inputs[$feature] ?? 0.0) : ($inputs[$i] ?? 0.0);
            // Standard Scaler: z = (x - u) / s
            $mean = $this->scalerX['mean'][$i];
            $scale = $this->scalerX['scale'][$i];
            
            // Avoid division by zero
            if ($scale == 0) $scale = 1.0;
            
            $x[] = ($val - $mean) / $scale;
        }

        // 2. Feedforward through layers
        $v = $x;
        $numLayers = count($this->weights);
        
        for ($layer = 0; $layer < $numLayers; $layer++) {
            $W = $this->weights[$layer];
            $B = $this->biases[$layer];
            $nextV = [];
            
            $numNeuronsNextLayer = count($B);
            $numNeuronsCurrentLayer = count($v);
            
            for ($j = 0; $j < $numNeuronsNextLayer; $j++) {
                $sum = $B[$j];
                for ($k = 0; $k < $numNeuronsCurrentLayer; $k++) {
                    // W is shape (currentLayer, nextLayer)
                    $sum += $v[$k] * $W[$k][$j];
                }
                
                // ReLU activation for hidden layers (not the last layer)
                if ($layer < $numLayers - 1) {
                    $sum = max(0.0, $sum);
                }
                $nextV[] = $sum;
            }
            $v = $nextV;
        }

        // 3. Inverse scale outputs
        $predictions = [];
        foreach ($this->targetFeatures as $i => $feature) {
            $val = $v[$i];
            $mean = $this->scalerY['mean'][$i];
            $scale = $this->scalerY['scale'][$i];
            
            // Inverse Standard Scaler: x = z * s + u
            $unscaled = $val * $scale + $mean;
            $predictions[$feature] = $unscaled;
        }

        return $predictions;
    }
}
